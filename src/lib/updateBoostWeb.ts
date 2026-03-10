import { GraphQLClient, gql } from 'graphql-request';

const UPDATE_BOOST_WEB = gql`
  mutation UpdateBoostWeb($input: UpdateBoostWebInput!) {
    updateBoostWeb(input: $input) {
      id
      boostStatus
      maxBudget
    }
  }
`;

function getGraphQLUrl(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/api/graphql`;
  }
  return process.env.NEXT_PUBLIC_GRAPHQL_URL || '/api/graphql';
}

export interface UpdateBoostWebInput {
  boostId: string;
  creatorWallet: string;
  boostStatus?: 'completed';
  maxBudget?: number;
}

export interface UpdateBoostWebOutput {
  id: string;
  boostStatus: string;
  maxBudget?: string;
}

export async function updateBoostWeb(
  input: UpdateBoostWebInput
): Promise<UpdateBoostWebOutput> {
  const url = getGraphQLUrl();
  const client = new GraphQLClient(url, {
    fetch: (inputUrl, init) => {
      const headers = new Headers(init?.headers);
      headers.delete('Authorization');
      return fetch(inputUrl, { ...init, credentials: 'omit', headers });
    },
  });
  const data = await client.request<{ updateBoostWeb: UpdateBoostWebOutput }>(
    UPDATE_BOOST_WEB,
    { input }
  );
  if (!data?.updateBoostWeb) {
    throw new Error('Failed to update boost');
  }
  return data.updateBoostWeb;
}
