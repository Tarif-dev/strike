import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PageContainer from "@/components/layout/PageContainer";
import Header from "@/components/layout/Header";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

// Schema for match creation form validation
const createMatchSchema = z
  .object({
    homeTeam: z.string({
      required_error: "Please select a home team",
    }),
    awayTeam: z.string({
      required_error: "Please select an away team",
    }),
    matchDate: z.date({
      required_error: "Please select a match date",
    }),
  })
  .refine((data) => data.homeTeam !== data.awayTeam, {
    message: "Home team and away team cannot be the same",
    path: ["awayTeam"],
  });

type CreateMatchFormValues = z.infer<typeof createMatchSchema>;

// List of IPL teams
const teams = [
  { code: "CSK", name: "Chennai Super Kings", logo: "/team_logos/csk.jpeg" },
  { code: "DC", name: "Delhi Capitals", logo: "/team_logos/dc.jpeg" },
  { code: "GT", name: "Gujarat Titans", logo: "/team_logos/gt.jpeg" },
  { code: "KKR", name: "Kolkata Knight Riders", logo: "/team_logos/kkr.jpeg" },
  { code: "LSG", name: "Lucknow Super Giants", logo: "/team_logos/lsg.jpeg" },
  { code: "MI", name: "Mumbai Indians", logo: "/team_logos/mi.jpeg" },
  { code: "PBKS", name: "Punjab Kings", logo: "/team_logos/pbks.jpeg" },
  {
    code: "RCB",
    name: "Royal Challengers Bengaluru",
    logo: "/team_logos/rcb.jpeg",
  },
  { code: "RR", name: "Rajasthan Royals", logo: "/team_logos/rr.jpeg" },
  { code: "SRH", name: "Sunrisers Hyderabad", logo: "/team_logos/srh.jpeg" },
];

const CreateMatch = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateMatchFormValues>({
    resolver: zodResolver(createMatchSchema),
    defaultValues: {
      homeTeam: "",
      awayTeam: "",
      matchDate: new Date(),
    },
  });

  const onSubmit = async (values: CreateMatchFormValues) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You must be logged in to create matches",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get team details from our local array
      const homeTeamData = teams.find((t) => t.code === values.homeTeam);
      const awayTeamData = teams.find((t) => t.code === values.awayTeam);

      if (!homeTeamData || !awayTeamData) {
        throw new Error("Invalid team selection");
      }

      // Generate a proper UUID instead of a string
      const uuid = crypto.randomUUID();

      // Calculate registration end time (1 hour before match)
      const matchDateTime = new Date(values.matchDate);
      const registrationEndTime = new Date(matchDateTime);
      registrationEndTime.setHours(registrationEndTime.getHours() - 1);

      // Match data to be stored
      const matchDetails = {
        teams: {
          home: {
            name: homeTeamData.name,
            code: homeTeamData.code,
            logo: homeTeamData.logo,
          },
          away: {
            name: awayTeamData.name,
            code: awayTeamData.code,
            logo: awayTeamData.logo,
          },
        },
        tournament: {
          name: "IPL 2025",
          shortName: "IPL",
        },
        venue: "TBD",
        startTime: matchDateTime.toISOString(),
        status: "upcoming",
        result: null,
        scores: {
          home: null,
          away: null,
        },
        fantasy: {
          contestCount: 30,
          prizePool: "₹5 Lakh",
          entryFees: [49, 99, 499, 999],
          teamsCreated: 0,
          percentageJoined: 0,
          isHotMatch: true,
        },
      };

      // Insert directly using Supabase client now that we have fixed the schema issues
      const { data, error } = await supabase
        .from("matches")
        .insert({
          admin: user.id,
          match_id: uuid, // Using proper UUID format
          registration_end_time: registrationEndTime.toISOString(),
          total_deposited: 0,
          is_active: true,
          is_finalized: false,
          bump: 1,
          token_bump: 1,
          match_details: matchDetails,
        })
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Match created successfully",
        description: `${homeTeamData.name} vs ${awayTeamData.name} on ${format(
          matchDateTime,
          "PPP"
        )}`,
      });

      // Navigate to matches page
      setTimeout(() => {
        navigate("/matches");
      }, 1500);

      // Clear form
      form.reset();
    } catch (error) {
      console.error("Error creating match:", error);
      toast({
        variant: "destructive",
        title: "Failed to create match",
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Header title="Create Match" />

      <div className="flex flex-col items-center justify-center mt-8 px-4">
        <div className="w-full max-w-xl space-y-6 bg-cricket-medium-green p-6 rounded-xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Create New Match</h1>
            <p className="text-muted-foreground mt-2">
              Create a new match for the fantasy league
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="homeTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Home Team</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select home team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.code} value={team.code}>
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                <img
                                  src={team.logo}
                                  alt={team.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {team.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="awayTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Away Team</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select away team" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.code} value={team.code}>
                            <div className="flex items-center">
                              <div className="w-6 h-6 rounded-full overflow-hidden mr-2">
                                <img
                                  src={team.logo}
                                  alt={team.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              {team.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="matchDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Match Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-cricket-dark-green",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Select the date when the match will be played
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-cricket-lime text-cricket-dark-green hover:bg-cricket-lime/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Match
                  </>
                ) : (
                  "Create Match"
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </PageContainer>
  );
};

export default CreateMatch;
