import { User } from "@/types";

export interface SetupUserStepProps {
  nextStep: string;
  userAvatars: string[];
  authenticatedUser: Partial<User>;
  onNext: (firstName: string, lastName: string, avatar?: string) => void;
}
