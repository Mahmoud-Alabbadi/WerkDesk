import React, { useState } from 'react';
    import { Bell, PlusCircle, Globe, Settings as SettingsIcon } from 'lucide-react';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
      DropdownMenuRadioGroup,
      DropdownMenuRadioItem,
    } from '@/components/ui/dropdown-menu';
    import { useAuth } from '@/hooks/useAuth';
    import { useLocation, useNavigate } from 'react-router-dom';
    import { useTranslation } from 'react-i18next';
    import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
    import RepairOrderForm from '@/components/RepairOrderForm'; // Assuming this handles new orders too
    import { useToast } from "@/components/ui/use-toast";

    const Topbar = ({ currentRole }) => {
      const { user, logout } = useAuth();
      const location = useLocation();
      const navigate = useNavigate();
      const { t, i18n } = useTranslation();
      const { toast } = useToast();
      const [isRepairOrderModalOpen, setIsRepairOrderModalOpen] = useState(false);
      const [newRepairOrderKey, setNewRepairOrderKey] = useState(Date.now()); // To reset form

      const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
      };

      const getPageTitle = () => {
        const pathSegments = location.pathname.split('/').filter(Boolean);
        const lastSegment = pathSegments.pop();
        if (!lastSegment || lastSegment === 'admin' || lastSegment === 'partner') return t('dashboard');
        // Use labelKey from sidebar for translation if available
        const navKey = lastSegment.replace('-', '_'); // e.g. repair-orders -> repair_orders
        return t(navKey, { defaultValue: lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1) });
      };
      
      const pageTitle = getPageTitle();

      const handleCreateRepairOrder = () => {
        setNewRepairOrderKey(Date.now()); // Force re-mount of form for new order
        setIsRepairOrderModalOpen(true);
      };
      
      const handleSaveNewRepairOrder = (repairOrderData) => {
        // In a real app, this would save to backend and update a global state/refetch list
        console.log("New Repair Order Data to save:", repairOrderData);
        // Create a dummy ticket ID or generate one
        const newTicketId = `T${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`; 
        
        // Update localStorage (or your state management)
        const currentTickets = JSON.parse(localStorage.getItem('werkdeskTickets')) || [];
        const newTicket = {
          id: newTicketId,
          date: repairOrderData.orderDate,
          status: 'New', // Default status
          partner: 'Self (Admin)', // Or derive
          customer: repairOrderData.customerName,
          phone: repairOrderData.customerPhone,
          device: `${repairOrderData.deviceBrand} ${repairOrderData.deviceModel}`,
          serial: repairOrderData.serialOrImei,
          service: repairOrderData.reason.substring(0,50), // Truncate reason for service
          price: repairOrderData.estimatedCost, // Or grandTotal from parts
          summary: repairOrderData.reason,
          repairOrderData: repairOrderData,
        };
        localStorage.setItem('werkdeskTickets', JSON.stringify([newTicket, ...currentTickets]));

        toast({ title: t('success'), description: t('repair_order_saved') });
        setIsRepairOrderModalOpen(false);
        // Potentially navigate to the new repair order detail or refresh list
        navigate(currentRole === 'Admin' ? '/admin/repair-orders' : '/partner/repair-orders', { replace: true });
        window.location.reload(); // Temp solution to show new order in list
      };


      return (
        <>
          <header className="fixed top-0 right-0 h-16 bg-card border-b flex items-center justify-between px-6 shadow-sm print:hidden" style={{ left: '240px', width: 'calc(100% - 240px)'}}>
            <div>
              <h1 className="text-xl font-semibold text-foreground leading-tight" style={{fontSize: '28px', lineHeight: '1.5' }}>{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={handleCreateRepairOrder} className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-md text-sm font-medium" style={{height: 'auto'}}>
                <PlusCircle className="mr-2 h-5 w-5" /> {t('create_repair_order')}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Globe className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value={i18n.language} onValueChange={changeLanguage}>
                    <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="de">Deutsch</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="relative">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.name || 'User'}`} alt={user?.name || 'User'} />
                      <AvatarFallback>{user?.name?.substring(0,2).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(currentRole === 'Admin' ? '/admin/settings' : '/partner/settings')}>
                     <SettingsIcon className="mr-2 h-4 w-4" />
                    {t('settings')}
                  </DropdownMenuItem>
                  <DropdownMenuItem> {t('profile')} </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <Dialog open={isRepairOrderModalOpen} onOpenChange={(isOpen) => {
            if (!isOpen) {
                setIsRepairOrderModalOpen(false);
            }
          }}>
            <DialogContent className="sm:max-w-4xl max-h-[95vh] overflow-y-auto p-0 rounded-lg">
                <RepairOrderForm 
                    key={newRepairOrderKey} // Force re-mount for new form
                    ticket={{ id: t('new_repair_order_id', { defaultValue: 'NEW' }) }} // Pass a dummy ticket or null
                    initialData={null} // Ensure it's a new form
                    onSave={handleSaveNewRepairOrder}
                    onCancel={() => setIsRepairOrderModalOpen(false)}
                    onExportPdf={() => toast({title: t('info'), description: t('save_order_before_export')})}
                />
            </DialogContent>
          </Dialog>
        </>
      );
    };

    export default Topbar;