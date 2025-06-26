import React, { useState } from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Dialog, DialogContent, DialogDescription as DialogUIDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
    import { Users, PlusCircle, Edit2, Trash2 } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useToast } from "@/components/ui/use-toast";
    import { useAuth } from "@/hooks/useAuth";

    const initialPartners = [
      { id: 'PTN001', name: 'TechFix Co.', email: 'contact@techfix.com', ticketsSubmitted: 125 },
      { id: 'PTN002', name: 'GadgetPro Solutions', email: 'support@gadgetpro.com', ticketsSubmitted: 88 },
      { id: 'PTN003', name: 'RepairHub Central', email: 'info@repairhub.com', ticketsSubmitted: 210 },
    ];

    const PartnersPage = () => {
      const { toast } = useToast();
      const { role } = useAuth();
      const [partners, setPartners] = useState(initialPartners);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [editingPartner, setEditingPartner] = useState(null);
      const [newPartnerData, setNewPartnerData] = useState({ name: '', email: '' });

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPartnerData(prev => ({ ...prev, [name]: value }));
      };

      const handleSubmitPartner = () => {
        if (!newPartnerData.name || !newPartnerData.email) {
            toast({ title: "Validation Error", description: "Partner Name and Email are required.", variant: "destructive" });
            return;
        }
        if (!/\S+@\S+\.\S+/.test(newPartnerData.email)) {
            toast({ title: "Validation Error", description: "Please enter a valid email address.", variant: "destructive" });
            return;
        }
        const newId = `PTN${String(partners.length + 1).padStart(3, '0')}`;
        const partnerToAdd = { id: newId, ...newPartnerData, ticketsSubmitted: 0 };
        setPartners(prev => [partnerToAdd, ...prev]);
        setIsModalOpen(false);
        setNewPartnerData({ name: '', email: '' });
        toast({ title: "Success!", description: `Partner ${newPartnerData.name} added successfully.` });
      };

      const handleEditPartner = (partner) => {
        setEditingPartner(partner);
        setNewPartnerData({ name: partner.name, email: partner.email });
        setIsModalOpen(true);
      };

      const handleSaveEdit = () => {
        if (!newPartnerData.name || !newPartnerData.email) {
            toast({ title: "Validation Error", description: "Partner Name and Email are required.", variant: "destructive" });
            return;
        }
         if (!/\S+@\S+\.\S+/.test(newPartnerData.email)) {
            toast({ title: "Validation Error", description: "Please enter a valid email address.", variant: "destructive" });
            return;
        }
        setPartners(prev => prev.map(p => p.id === editingPartner.id ? {...p, ...newPartnerData} : p));
        setIsModalOpen(false);
        setEditingPartner(null);
        setNewPartnerData({ name: '', email: '' });
        toast({ title: "Success!", description: `Partner ${editingPartner.name} updated.` });
      };

      const handleDeletePartner = (partnerId) => {
        setPartners(prev => prev.filter(p => p.id !== partnerId));
        toast({ title: "Deleted", description: `Partner has been removed.`, variant: "destructive" });
      };

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl font-bold">
                <Users className="mr-3 h-7 w-7 text-primary"/>Partners Management
              </CardTitle>
              <CardDescription>Manage partner accounts and view their activities.</CardDescription>
            </CardHeader>
            <CardContent>
              {role === 'Admin' && (
                <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
                    setIsModalOpen(isOpen);
                    if(!isOpen) {
                        setEditingPartner(null);
                        setNewPartnerData({name: '', email: ''});
                    }
                }}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="mb-6 text-base" onClick={() => { setEditingPartner(null); setNewPartnerData({name: '', email: ''}); setIsModalOpen(true); }}>
                      <PlusCircle className="mr-2 h-5 w-5" /> Add New Partner
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">{editingPartner ? "Edit Partner" : "Add New Partner"}</DialogTitle>
                      <DialogUIDescription>
                        {editingPartner ? "Update the partner's details." : "Fill in the details to add a new partner."}
                      </DialogUIDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right text-sm">Name</Label>
                        <Input id="name" name="name" value={newPartnerData.name} onChange={handleInputChange} className="col-span-3 text-sm" />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right text-sm">Email</Label>
                        <Input id="email" name="email" type="email" value={newPartnerData.email} onChange={handleInputChange} className="col-span-3 text-sm" />
                      </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button type="submit" onClick={editingPartner ? handleSaveEdit : handleSubmitPartner}>{editingPartner ? "Save Changes" : "Add Partner"}</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      <TableHead className="text-sm">Partner ID</TableHead>
                      <TableHead className="text-sm">Name</TableHead>
                      <TableHead className="text-sm">Email</TableHead>
                      <TableHead className="text-sm">Tickets Submitted</TableHead>
                      {role === 'Admin' && <TableHead className="text-sm">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                    {partners.map((partner) => (
                      <motion.tr 
                        key={partner.id} 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-accent/50 transition-colors duration-150"
                      >
                        <TableCell className="font-medium text-primary hover:underline cursor-pointer text-sm">{partner.id}</TableCell>
                        <TableCell className="text-sm">{partner.name}</TableCell>
                        <TableCell className="text-sm">{partner.email}</TableCell>
                        <TableCell className="text-sm">{partner.ticketsSubmitted}</TableCell>
                        {role === 'Admin' && (
                          <TableCell className="space-x-1 text-sm">
                            <Button variant="ghost" size="icon" onClick={() => handleEditPartner(partner)} className="hover:text-blue-600">
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDeletePartner(partner.id)} className="hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        )}
                      </motion.tr>
                    ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
              {partners.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No partners found.</div>
              )}
            </CardContent>
            <CardFooter className="pt-6 border-t">
                <p className="text-sm text-muted-foreground">Total Partners: {partners.length}</p>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };
    export default PartnersPage;