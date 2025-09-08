// app/interests/page.tsx
"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Heart } from "lucide-react";
import InterestCard from "@/components/interests/InterestCard";
import LoadingState from "@/components/interests/LoadingState";
import { useAvailableInterestsQuery } from "@/api/queries/interests";
import { useSelectInterestsMutation } from "@/api/mutations/interests";

export default function FirstTimeInterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const { data: availableInterests, isLoading } = useAvailableInterestsQuery();
  const selectInterestsMutation = useSelectInterestsMutation();

  const toggleInterest = (interestId: string) => {
    setSelectedInterests(prev => {
      if (prev.includes(interestId)) {
        return prev.filter(id => id !== interestId);
      } else {
        if (prev.length >= 3) {
          setError("You can select maximum 3 interests");
          return prev;
        }
        setError("");
        return [...prev, interestId];
      }
    });
  };

  const handleSubmit = async () => {
    if (selectedInterests.length === 0) {
      setError("Please select at least 1 interest");
      return;
    }

    try {
      await selectInterestsMutation.mutateAsync({
        interestIds: selectedInterests
      });

      // Muvaffaqiyatli saqlandi, home page ga o'tkaz
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save interests");
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Welcome! Choose Your Interests
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select 1-3 topics you are passionate about to personalize your experience
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            Select {selectedInterests.length}/3 interests
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {availableInterests?.map((interest) => (
            <InterestCard
              key={interest._id}
              interest={interest}
              isSelected={selectedInterests.includes(interest._id)}
              onToggle={toggleInterest}
            />
          ))}
        </div>



        <div className="text-center">
          <Button
            onClick={handleSubmit}
            disabled={selectedInterests.length === 0 || selectInterestsMutation.isPending}
            className="px-8 py-6 text-lg font-semibold"
          >
            {selectInterestsMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              "Get Started"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}