export interface UserProfile {
    uid: string;
    email: string;
    name?: string;
    favoriteTeam?: string;
    profilePicture?: string;
  }
  
  export interface Game {
    id: string;              
    homeTeam: string;        
    awayTeam: string;        
    date: string;            
    time: string;            
    league: string;          
    venue: string;          
    status: string;          
    homeTeamBadge?: string;  
    awayTeamBadge?: string;  
  }