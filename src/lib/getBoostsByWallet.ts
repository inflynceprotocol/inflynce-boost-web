import { GraphQLClient, gql } from 'graphql-request';

export interface BoostRecastRecord {
  user?: { pfpUrl?: string | null; displayName?: string | null; username?: string | null } | null;
}

export interface Boost {
  id: string;
  castUrl: string | null;
  castHash: string | null;
  boostStatus: string | null;
  maxBudget: number | null;
  createdAt: string;
  creatorWallet: string | null;
  enableOpen: boolean | null;
  user?: { pfpUrl?: string | null; displayName?: string | null; username?: string | null } | null;
  boostRecastRecords?: BoostRecastRecord[];
  boostRecastRecordsAggregate?: {
    aggregate?: { count: number };
  };
  boostRecastRecordsAggregateConfirmed?: {
    aggregate?: { sum?: { creatorTotalCost: string | null } };
  };
}

const GET_BOOSTS_BY_WALLET = gql`
  query GetBoostsByWallet($creatorWallet: String!, $limit: Int, $offset: Int) {
    mindshare_boosts(
      where: { creatorWallet: { _eq: $creatorWallet } }
      order_by: { createdAt: desc }
      limit: $limit
      offset: $offset
    ) {
      id
      castUrl
      castHash
      boostStatus
      maxBudget
      createdAt
      creatorWallet
      enableOpen
      user {
        pfpUrl
        displayName
        username
      }
      boostRecastRecords(limit: 8) {
        user {
          pfpUrl
          displayName
          username
        }
      }
      boostRecastRecords_aggregate {
        aggregate {
          count(columns: boostId)
        }
      }
      boostRecastRecords_aggregate_confirmed: boostRecastRecords_aggregate(
        where: { txStatus: { _eq: "confirmed" } }
      ) {
        aggregate {
          sum {
            creatorTotalCost
          }
        }
      }
    }
  }
`;

function getGraphQLUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/graphql`;
  }
  return process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql';
}

export async function getBoostsByWallet(
  creatorWallet: string,
  limit = 20,
  offset = 0
): Promise<Boost[]> {
  const url = getGraphQLUrl();
  const client = new GraphQLClient(url);
  const data = await client.request<{ mindshare_boosts: Boost[] }>(GET_BOOSTS_BY_WALLET, {
    creatorWallet,
    limit,
    offset,
  });
  const boosts = data?.mindshare_boosts ?? [];
  return boosts.map((b: any) => ({
    ...b,
    boostRecastRecords: b.boostRecastRecords ?? [],
    boostRecastRecordsAggregate: b.boostRecastRecords_aggregate,
    boostRecastRecordsAggregateConfirmed: b.boostRecastRecords_aggregate_confirmed,
  }));
}
