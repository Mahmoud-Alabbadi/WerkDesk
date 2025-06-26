import React from 'react';
    import { NavLink, useLocation } from 'react-router-dom';
    import WerkDeskLogo from '@/assets/WerkDeskLogo';
    import { Button } from '@/components/ui/button';
    import { Separator } from '@/components/ui/separator';
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
    import { Home, FileText, Package, Users, BarChart2, Settings, LifeBuoy, LogOut } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { useAuth } from '@/hooks/useAuth';
    import { useTranslation } from 'react-i18next';

    const Sidebar = ({ currentRole }) => {
      const location = useLocation();
      const { logout } = useAuth();
      const { t } = useTranslation();

      const navItemsBase = [
        { to: '/dashboard', icon: Home, labelKey: 'dashboard' },
        { to: '/repair-orders', icon: FileText, labelKey: 'repair_orders' }, // Changed from tickets
        { to: '/inventory', icon: Package, labelKey: 'inventory' },
        { to: '/partners', icon: Users, labelKey: 'partners' },
        { to: '/reports', icon: BarChart2, labelKey: 'reports' },
      ];
      
      const settingsItem = { to: '/settings', icon: Settings, labelKey: 'settings' };
      const logoutItem = { action: logout, icon: LogOut, labelKey: 'logout' };


      const getNavItems = () => {
        let items = [...navItemsBase];
        if (currentRole === 'Partner') {
          items = items.filter(item => ['/dashboard', '/repair-orders'].includes(item.to));
        }
        const prefix = currentRole === 'Admin' ? '/admin' : '/partner';
        return items.map(item => ({ ...item, to: `${prefix}${item.to}`, label: t(item.labelKey) }))
                    .concat([{...settingsItem, to: `${prefix}${settingsItem.to}`, label: t(settingsItem.labelKey) }]);
      }
      
      const navItems = getNavItems();

      return (
        <TooltipProvider delayDuration={100}>
          <aside className="w-sidebar fixed top-0 left-0 h-full bg-card border-r flex flex-col py-6 shadow-xl print:hidden">
            <div className="px-6 mb-10">
              <NavLink to={currentRole === 'Admin' ? "/admin/dashboard" : "/partner/dashboard"} className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
                <WerkDeskLogo className="h-10 w-10" />
                <h1 className="text-2xl font-bold text-primary">WerkDesk</h1>
              </NavLink>
            </div>

            <nav className="flex-grow px-4 space-y-2">
              {navItems.map((item) => (
                <Tooltip key={item.to}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ease-in-out group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card
                        ${isActive || (location.pathname.startsWith(item.to) && item.to !== (currentRole === 'Admin' ? '/admin' : '/partner') + '/dashboard' || (location.pathname === (currentRole === 'Admin' ? '/admin' : '/partner') + '/dashboard' && item.to === (currentRole === 'Admin' ? '/admin' : '/partner') + '/dashboard'))
                          ? 'bg-primary text-primary-foreground shadow-lg transform scale-[1.02]'
                          : 'text-muted-foreground hover:bg-primary/10 hover:text-primary hover:scale-[1.01] active:scale-[0.99]'
                        }`
                      }
                    >
                      <item.icon className={`h-5 w-5 stroke-[2.5px] group-hover:scale-110 transition-transform duration-200 ${location.pathname.startsWith(item.to) ? 'text-primary-foreground' : ''}`} />
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-gray-800 text-white border-none rounded-md px-2 py-1 text-xs shadow-lg">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>

            <Separator className="my-4" />

            <div className="px-6 mt-auto space-y-4">
              <motion.div 
                className="p-4 bg-gradient-to-tr from-primary/5 via-accent/30 to-secondary/20 rounded-lg border border-primary/10 shadow-inner"
                initial={{ opacity: 0, y:10 }}
                animate={{ opacity: 1, y:0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <LifeBuoy className="h-6 w-6 text-primary" />
                  <h3 className="text-base font-semibold text-foreground">{t('support_center')}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{t('need_help')}</p>
                <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm py-2 shadow-md hover:shadow-lg transition-all duration-150">{t('contact_support')}</Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
                <Button variant="outline" className="w-full text-base py-3 border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary" onClick={logoutItem.action}>
                  <logoutItem.icon className="mr-2 h-5 w-5 stroke-[2.5px]" /> {t(logoutItem.labelKey)}
                </Button>
              </motion.div>
            </div>
          </aside>
        </TooltipProvider>
      );
    };

    export default Sidebar;