
import Header from '@/components/layout/Header';
import Navbar from '@/components/layout/Navbar';
import PageContainer from '@/components/layout/PageContainer';
import LeagueCard from '@/components/cricket/LeagueCard';
import { leagues } from '@/data/mockData';

const Leagues = () => {
  const myLeagues = leagues.filter(league => league.joined);
  const availableLeagues = leagues.filter(league => !league.joined);
  
  return (
    <>
      <PageContainer>
        <Header title="Leagues" />
        
        <div className="space-y-6 mt-4">
          {myLeagues.length > 0 && (
            <>
              <h2 className="text-lg font-bold">My Leagues</h2>
              <div className="grid grid-cols-1 gap-4">
                {myLeagues.map(league => (
                  <LeagueCard key={league.id} league={league} />
                ))}
              </div>
            </>
          )}
          
          <h2 className="text-lg font-bold">Available Leagues</h2>
          <div className="grid grid-cols-1 gap-4">
            {availableLeagues.map(league => (
              <LeagueCard key={league.id} league={league} />
            ))}
          </div>
        </div>
      </PageContainer>
      
      <Navbar />
    </>
  );
};

export default Leagues;
