import { GraphQLClient, gql } from 'graphql-request';

export interface PostBoostWebInput {
  castUrl: string;
  castHash: string;
  creatorWallet: string;
  mindshareFilterDuration: number;
  minMindshare: string;
  multiplier: number;
  paymentHash: string;
  maxBudget: string;
  appType: number;
}

export interface PostBoostWebOutput {
  id: string;
  boostStatus: string;
  creatorWallet: string;
}

const POST_BOOST_WEB = gql`
  mutation PostBoostWeb($input: PostBoostWebInput!) {
    postBoostWeb(input: $input) {
      id
      boostStatus
      creatorWallet
    }
  }
`;

function getGraphQLUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/graphql`;
  }
  return process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql';
}

export async function postBoostWeb(
  _graphqlUrl: string | undefined,
  input: PostBoostWebInput
): Promise<PostBoostWebOutput> {
  const url = _graphqlUrl || getGraphQLUrl();
  const client = new GraphQLClient(url, {
    fetch: (input, init) => {
      const headers = new Headers(init?.headers);
      headers.delete('Authorization');
      return fetch(input, { ...init, credentials: 'omit', headers });
    },
  });
  const data = await client.request<{ postBoostWeb: PostBoostWebOutput }>(POST_BOOST_WEB, {
    input,
  });
  if (!data?.postBoostWeb) {
    throw new Error('Failed to create boost');
  }
  return data.postBoostWeb;
}
