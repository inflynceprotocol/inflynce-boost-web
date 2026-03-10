import { GraphQLClient, gql } from 'graphql-request';

const GET_CAMPAIGN_ANALYTICS = gql`
  query GetCampaignAnalyticsAction($boostId: uuid!, $interval: String) {
    getCampaignAnalytics(boostId: $boostId, interval: $interval) {
      overview {
        totalSpent
        totalEngagement
        paidEngagement
        engagementRatio
        cpc
        campaignStarted
        campaignEnd
        campaignRules
        boostStatus
      }
      cumulativeSpending {
        timestamp
        cumulativeSpending
        hourlySpending
      }
      mindshareDistribution {
        tiers {
          tier
          count
          percentage
          avgMindshare
          avgPayment
        }
        avgMindshare
        avgPayment
        topEarners {
          user {
            displayName
            username
            fid
            pfpUrl
          }
          mindshare
          payment
        }
      }
      performance {
        totalRecasts
        uniqueUsers
        avgMindshare
        avgPayment
      }
    }
  }
`;

const GET_BOOST_RECAST_RECORDS = gql`
  query GetBoostRecastsByBoostId($boostId: uuid!, $limit: Int, $offset: Int) {
    boost_recast_records(
      where: { boostId: { _eq: $boostId }, txStatus: { _eq: "confirmed" } }
      order_by: { createdAt: desc }
      limit: $limit
      offset: $offset
    ) {
      id
      recasterFid
      createdAt
      mindshare
      earnedAmount
      netRewardAmount
      user {
        displayName
        username
        fid
        pfpUrl
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

export interface RecastRecord {
  id: string;
  recasterFid: string;
  createdAt: string;
  mindshare: string;
  earnedAmount: string | null;
  netRewardAmount: string | null;
  user?: {
    displayName: string | null;
    username: string | null;
    fid: string;
    pfpUrl: string | null;
  } | null;
}

export async function fetchCampaignAnalytics(
  boostId: string,
  interval = '30m'
): Promise<{ getCampaignAnalytics: Record<string, unknown> } | null> {
  const url = getGraphQLUrl();
  const client = new GraphQLClient(url);
  try {
    const data = await client.request(GET_CAMPAIGN_ANALYTICS, {
      boostId,
      interval,
    });
    return data as { getCampaignAnalytics: Record<string, unknown> };
  } catch (err) {
    console.error('Failed to fetch campaign analytics:', err);
    return null;
  }
}

export async function fetchBoostRecastRecords(
  boostId: string,
  limit = 20,
  offset = 0
): Promise<RecastRecord[]> {
  const url = getGraphQLUrl();
  const client = new GraphQLClient(url);
  try {
    const data = (await client.request(GET_BOOST_RECAST_RECORDS, {
      boostId,
      limit,
      offset,
    })) as { boost_recast_records: RecastRecord[] };
    return data?.boost_recast_records ?? [];
  } catch (err) {
    console.error('Failed to fetch recast records:', err);
    return [];
  }
}
