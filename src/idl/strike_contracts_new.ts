export const IDL = {
  "address": "2Bnp9uikuv1EuAfHbcXizF8FcqNDKQg7hfuKbLC9y6hT",
  "metadata": {
    "name": "strike_contracts_new",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "close_match_pool",
      "discriminator": [
        71,
        44,
        194,
        23,
        6,
        67,
        237,
        224
      ],
      "accounts": [
        {
          "name": "match_pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  116,
                  99,
                  104,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "match_pool.match_id",
                "account": "MatchPool"
              }
            ]
          }
        },
        {
          "name": "pool_token_account",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "match_pool.match_id",
                "account": "MatchPool"
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "deposit",
      "discriminator": [
        242,
        35,
        198,
        137,
        82,
        225,
        242,
        182
      ],
      "accounts": [
        {
          "name": "match_pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  116,
                  99,
                  104,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "match_pool.match_id",
                "account": "MatchPool"
              }
            ]
          }
        },
        {
          "name": "pool_token_account",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "match_pool.match_id",
                "account": "MatchPool"
              }
            ]
          }
        },
        {
          "name": "user_token_account",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "distribute_prizes",
      "discriminator": [
        154,
        99,
        201,
        93,
        82,
        104,
        73,
        232
      ],
      "accounts": [
        {
          "name": "match_pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  116,
                  99,
                  104,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "match_pool.match_id",
                "account": "MatchPool"
              }
            ]
          }
        },
        {
          "name": "pool_token_account",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "match_pool.match_id",
                "account": "MatchPool"
              }
            ]
          }
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "prize_distributions",
          "type": {
            "vec": {
              "defined": {
                "name": "PrizeDistribution"
              }
            }
          }
        }
      ]
    },
    {
      "name": "end_match",
      "discriminator": [
        34,
        116,
        122,
        191,
        100,
        222,
        20,
        117
      ],
      "accounts": [
        {
          "name": "match_pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  116,
                  99,
                  104,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "match_pool.match_id",
                "account": "MatchPool"
              }
            ]
          }
        },
        {
          "name": "admin",
          "signer": true
        },
        {
          "name": "sytem_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "match_pool",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  97,
                  116,
                  99,
                  104,
                  95,
                  112,
                  111,
                  111,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "match_id"
              }
            ]
          }
        },
        {
          "name": "pool_token_account",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  111,
                  111,
                  108,
                  95,
                  116,
                  111,
                  107,
                  101,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "match_id"
              }
            ]
          }
        },
        {
          "name": "token_mint"
        },
        {
          "name": "admin",
          "writable": true,
          "signer": true
        },
        {
          "name": "token_program",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associated_token_program",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "match_id",
          "type": "string"
        },
        {
          "name": "registration_end_time",
          "type": "i64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "MatchPool",
      "discriminator": [
        114,
        28,
        170,
        141,
        232,
        190,
        43,
        48
      ]
    }
  ],
  "events": [
    {
      "name": "DepositEvent",
      "discriminator": [
        120,
        248,
        61,
        83,
        31,
        142,
        107,
        144
      ]
    },
    {
      "name": "MatchEndedEvent",
      "discriminator": [
        33,
        221,
        177,
        240,
        190,
        70,
        251,
        77
      ]
    },
    {
      "name": "PrizeDistributedEvent",
      "discriminator": [
        105,
        136,
        95,
        100,
        163,
        96,
        224,
        231
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MatchInactive",
      "msg": "Match is inactive"
    },
    {
      "code": 6001,
      "name": "MatchStillActive",
      "msg": "Match is still active"
    },
    {
      "code": 6002,
      "name": "MatchFinalized",
      "msg": "Match is finalized"
    },
    {
      "code": 6003,
      "name": "MatchAlreadyFinalized",
      "msg": "Match is already finalized"
    },
    {
      "code": 6004,
      "name": "MatchNotFinalized",
      "msg": "Match not finalized"
    },
    {
      "code": 6005,
      "name": "RegistrationClosed",
      "msg": "Registration is closed"
    },
    {
      "code": 6006,
      "name": "Unauthorized",
      "msg": "Unauthorized"
    },
    {
      "code": 6007,
      "name": "InsufficientPoolFunds",
      "msg": "Insufficient funds in the pool"
    },
    {
      "code": 6008,
      "name": "WinnerAccountNotFound",
      "msg": "Winner account not found"
    },
    {
      "code": 6009,
      "name": "PoolNotEmpty",
      "msg": "Pool not empty"
    }
  ],
  "types": [
    {
      "name": "DepositEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "match_id",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "MatchEndedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "match_id",
            "type": "string"
          },
          {
            "name": "total_deposited",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "MatchPool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "admin",
            "type": "pubkey"
          },
          {
            "name": "match_id",
            "type": "string"
          },
          {
            "name": "registration_end_time",
            "type": "i64"
          },
          {
            "name": "total_deposited",
            "type": "u64"
          },
          {
            "name": "is_active",
            "type": "bool"
          },
          {
            "name": "is_finalized",
            "type": "bool"
          },
          {
            "name": "deposits",
            "type": {
              "vec": {
                "defined": {
                  "name": "UserDeposit"
                }
              }
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "token_bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "PrizeDistributedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "match_id",
            "type": "string"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "PrizeDistribution",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "UserDeposit",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ]
}