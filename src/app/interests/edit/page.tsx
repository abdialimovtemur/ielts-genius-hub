// app/interests/edit/page.tsx
"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, Heart, ArrowLeft } from "lucide-react";
import { useUpdateInterestsMutation } from "@/api/mutations/interests";
import { useAvailableInterestsQuery } from "@/api/queries/interests";
import { useProfileQuery } from "@/api/queries/profile"; // ✅ ProfileQuery import qilish
import InterestCard from "@/components/interests/InterestCard";
import LoadingState from "@/components/interests/LoadingState";

export default function EditInterestsPage() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const { data: availableInterests, isLoading } = useAvailableInterestsQuery();
  const { data: userProfile } = useProfileQuery(); // ✅ ProfileQuery dan foydalanish
  const updateInterestsMutation = useUpdateInterestsMutation();

  // User interests from profile
  const userInterests = userProfile?.interests || [];

  // Initialize with user's current interests
  useEffect(() => {
    if (userInterests && userInterests.length > 0) {
      setSelectedInterests(userInterests.map(interest => interest._id));
    }
  }, [userInterests]);

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
      await updateInterestsMutation.mutateAsync({
        interests: selectedInterests
      });

      // Profile page ga qaytish
      router.push("/profile");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update interests");
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with back button */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/profile")}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
        </div>

        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Heart className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Edit Your Interests
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Update your interests to get personalized recommendations
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
            disabled={selectedInterests.length === 0 || updateInterestsMutation.isPending}
            className="px-8 py-6 text-lg font-semibold mr-4"
          >
            {updateInterestsMutation.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => router.push("/profile")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}