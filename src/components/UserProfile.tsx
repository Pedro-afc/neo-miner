
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User } from 'lucide-react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

interface UserProfileProps {
  user: TelegramUser;
  onLogout: () => void;
}

const UserProfile = ({ user, onLogout }: UserProfileProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user.photo_url ? (
              <img 
                src={user.photo_url} 
                alt={user.first_name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <p className="text-white font-medium">
                {user.first_name} {user.last_name}
              </p>
              {user.username && (
                <p className="text-gray-300 text-sm">@{user.username}</p>
              )}
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            size="sm"
            className="text-gray-300 hover:text-white hover:bg-white/10"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
