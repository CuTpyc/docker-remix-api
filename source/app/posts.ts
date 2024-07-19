import { matchSorter } from "match-sorter";
import sortBy from "sort-by";

type PostsMutation = {
  id?: string;
  title?: string;
  body?: string;
  userId?: string;
  views?: number;
};

export type PostsRecord = PostsMutation & {
  id: string;
  createdAt: string;
};

const API_URL = "https://dummyjson.com/posts";

async function fetchContacts(): Promise<PostsRecord[]> {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch contacts: ${response.statusText}`);
  }
  const data = await response.json();
  return data.posts;
}


export async function getPosts(query?: string | null) {
  const contacts = await fetchContacts();
  let filteredContacts = contacts;
  if (query) {
    filteredContacts = matchSorter(contacts, query, {
      keys: ["firstName", "lastName"],
    });
  }
  return filteredContacts.sort(sortBy("lastName", "createdAt"));
}

export async function getPost(id: string) {
  const response = await fetch(`${API_URL}/${id}`);
  const data = await response.json();
  return data;
}

export async function createPost(contactData: PostsMutation) {
  const response = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(contactData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create contact: ${response.statusText}`);
  }

  return await response.json();
}

export async function updatePost(id: string, updates: PostsMutation) {
  const response = await fetch(`${API_URL}${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update contact: ${response.statusText}`);
  }
  // TODO: UPDATE LOGIC
  return await response.json();
}

export async function deletePost(id: string) {
  const response = await fetch(`${API_URL}${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete contact: ${response.statusText}`);
  }
  // TODO: UPDATE LOGIC
  return id;
}
