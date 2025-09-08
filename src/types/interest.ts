// types/interest.ts
export interface Interest {
  _id: string;
  name: string;
  icon: string;
}

export interface SelectInterestsRequest {
  interestIds: string[];
}

export interface UpdateInterestsRequest {
  interests: string[];
}

export interface InterestSelectResponse {
  message: string;
  selectedInterests: Interest[];
}

export interface InterestUpdateResponse {
  _id: string;
  name: string;
  email: string;
  interests: Interest[];
}