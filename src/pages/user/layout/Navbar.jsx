import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Briefcase, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../../../components/ui/avatar';
import { ModeToggle } from '../../../components/ui/mode-toggle';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../../../components/ui/hover-card';
import LoginDialog from '../components/LoginDialog';
import { useSession, signOut } from '../../../lib/auth-client';

const Navbar = () => {
  const { data: session, isPending } = useSession();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80"
    >
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center"
        >
          <span className="text-xl font-bold tracking-tight">
            Deplofiy
          </span>
        </motion.div>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
          ) : session?.user ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center"
            >
              <HoverCard openDelay={200} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="outline-none focus:outline-none"
                  >
                    <Avatar className="h-10 w-10 cursor-pointer hover:opacity-80 transition-opacity">
                      <AvatarImage src={session.user.image} alt={session.user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-foreground text-sm font-medium">
                        {session.user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </motion.button>
                </HoverCardTrigger>
                <HoverCardContent className="w-72 rounded-3xl p-1 shadow-xl border-border/50" align="end" sideOffset={8}>
                  <div className="flex flex-col py-2">
                    <div className="flex flex-col px-4 py-3 mb-1">
                      <p className="text-sm font-semibold leading-tight">{session.user.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {session.user.email}
                      </p>
                    </div>
                    <div className="border-t border-border/50 my-1" />
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-11 rounded-xl text-sm font-normal px-4 hover:bg-accent/50 cursor-pointer"
                      onClick={() => navigate('/workspace/settings')}
                    >
                      <User className="mr-3 h-4 w-4" />
                      <span>Profile</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-11 rounded-xl text-sm font-normal px-4 hover:bg-accent/50 cursor-pointer"
                      onClick={() => navigate('/workspace/add-project')}
                    >
                      <Briefcase className="mr-3 h-4 w-4" />
                      <span>Workspace</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-11 rounded-xl text-sm font-normal px-4 hover:bg-accent/50 cursor-pointer"
                      onClick={() => navigate('/workspace/settings')}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      <span>Settings</span>
                    </Button>
                    {session?.user?.role === 'admin' && (
                      <>
                        <div className="border-t border-border/50 my-1" />
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-11 rounded-xl text-sm font-normal px-4 hover:bg-accent/50"
                          onClick={() => navigate('/admin')}
                        >
                          <LayoutDashboard className="mr-3 h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Button>
                      </>
                    )}
                    <div className="border-t border-border/50 my-1" />
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-11 rounded-xl text-sm font-normal px-4 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => signOut()}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Button
                onClick={() => setIsLoginOpen(true)}
                className="h-10 rounded-full px-6 text-sm font-medium bg-foreground text-background hover:bg-foreground/90"
              >
                Sign In
              </Button>
            </motion.div>
          )}
          <ModeToggle />
        </div>
      </div>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </motion.nav>
  );
};

export default Navbar;

