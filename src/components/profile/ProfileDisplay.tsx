"use client"

import { User } from "@/types/user"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

interface ProfileDisplayProps {
  profile: User
}

export default function ProfileDisplay({ 
  profile
}: ProfileDisplayProps) {
  // Date formatting function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 01-12
    const day = String(date.getDate()).padStart(2, '0'); // 01-31
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-500">Full Name</label>
          <p className="text-lg text-gray-800 font-medium">{profile.name}</p>
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-500">Email Address</label>
          <p className="text-lg text-gray-800 font-medium">{profile.email}</p>
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-500">Phone Number</label>
          <p className="text-lg text-gray-800 font-medium">{profile.phone}</p>
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-500">Account Type</label>
          <p className="text-lg text-gray-800 font-medium capitalize">{profile.role}</p>
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-500">Member Since</label>
          <p className="text-lg text-gray-800 font-medium">
            {formatDate(profile.createdAt)}
          </p>
        </div>
        
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-500">Last Updated</label>
          <p className="text-lg text-gray-800 font-medium">
            {formatDate(profile.updatedAt)}
          </p>
        </div>

        {/* Interests Section */}
        <div className="md:col-span-2 space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-500">Interests</label>
            <Button asChild variant="outline" size="sm">
              <Link href="/interests/edit">
                <Edit className="h-4 w-4 mr-2" />
                Edit Interests
              </Link>
            </Button>
          </div>
          
          {profile.interests && profile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest._id}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {interest.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mt-2">No interests selected yet</p>
          )}
        </div>
      </div>
    </div>
  )
}