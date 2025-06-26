import React, { useState } from 'react';
    import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
    import { Dialog, DialogContent, DialogDescription as DialogUIDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
    import { Package, PlusCircle, Search, Filter, Edit2, Trash2, ShoppingCart, FileDown, AlertTriangle as TriangleAlert } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { useToast } from "@/components/ui/use-toast";

    const initialParts = [
      { id: 'P001', name: 'iPhone 13 Screen', brand: 'Apple', category: 'Screens', stock: 15, threshold: 5, cost: 80, retail: 150, supplier: 'ScreenSource Ltd.', barcode: '123456789012' },
      { id: 'P002', name: 'Samsung S22 Battery', brand: 'Samsung', category: 'Batteries', stock: 3, threshold: 5, cost: 30, retail: 80, supplier: 'PowerUp Inc.', barcode: '234567890123' },
      { id: 'P003', name: 'MacBook Pro Keyboard Assembly', brand: 'Apple', category: 'Keyboards', stock: 8, threshold: 3, cost: 60, retail: 120, supplier: 'KeyMasters', barcode: '345678901234' },
      { id: 'P004', name: 'Dell XPS 15 Fan', brand: 'Dell', category: 'Cooling', stock: 12, threshold: 4, cost: 20, retail: 45, supplier: 'CoolParts Co.', barcode: '456789012345' },
    ];

    const InventoryPage = () => {
      const { toast } = useToast();
      const [parts, setParts] = useState(initialParts);
      const [searchTerm, setSearchTerm] = useState('');
      const [categoryFilter, setCategoryFilter] = useState('all');
      const [supplierFilter, setSupplierFilter] = useState('all');
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [editingPart, setEditingPart] = useState(null);
      const [newPartData, setNewPartData] = useState({
        name: '', brand: '', category: '', stock: '', threshold: '', cost: '', retail: '', supplier: '', barcode: ''
      });

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPartData(prev => ({ ...prev, [name]: value }));
      };

      const filteredParts = parts.filter(part =>
        (part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         part.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
         part.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
         part.barcode.includes(searchTerm)) &&
        (categoryFilter === 'all' || part.category === categoryFilter) &&
        (supplierFilter === 'all' || part.supplier === supplierFilter)
      );

      const handleSubmitPart = () => {
        if (!newPartData.name || !newPartData.category || !newPartData.stock || !newPartData.cost || !newPartData.retail) {
            toast({ title: "Validation Error", description: "Name, Category, Stock, Cost, and Retail Price are required.", variant: "destructive" });
            return;
        }
        const newId = `P${String(parts.length + 1).padStart(3, '0')}`;
        const partToAdd = { 
            id: newId, 
            ...newPartData,
            stock: parseInt(newPartData.stock),
            threshold: parseInt(newPartData.threshold) || 0,
            cost: parseFloat(newPartData.cost),
            retail: parseFloat(newPartData.retail)
        };
        setParts(prev => [partToAdd, ...prev]);
        setIsModalOpen(false);
        setNewPartData({ name: '', brand: '', category: '', stock: '', threshold: '', cost: '', retail: '', supplier: '', barcode: ''});
        toast({ title: "Success!", description: `Part ${newId} - ${newPartData.name} added successfully.` });
      };

      const handleEditPart = (part) => {
        setEditingPart(part);
        setNewPartData(part);
        setIsModalOpen(true);
      };

      const handleSaveEdit = () => {
        if (!newPartData.name || !newPartData.category || !newPartData.stock || !newPartData.cost || !newPartData.retail) {
            toast({ title: "Validation Error", description: "Name, Category, Stock, Cost, and Retail Price are required.", variant: "destructive" });
            return;
        }
        setParts(prev => prev.map(p => p.id === editingPart.id ? {...p, ...newPartData, stock: parseInt(newPartData.stock), threshold: parseInt(newPartData.threshold) || 0, cost: parseFloat(newPartData.cost), retail: parseFloat(newPartData.retail)} : p));
        setIsModalOpen(false);
        setEditingPart(null);
        setNewPartData({ name: '', brand: '', category: '', stock: '', threshold: '', cost: '', retail: '', supplier: '', barcode: ''});
        toast({ title: "Success!", description: `Part ${editingPart.id} updated.` });
      };

      const handleDeletePart = (partId) => {
        setParts(prev => prev.filter(p => p.id !== partId));
        toast({ title: "Deleted", description: `Part ${partId} has been removed.`, variant: "destructive" });
      };

      const handleRestock = (partId) => {
        setParts(prevParts => prevParts.map(p => p.id === partId ? {...p, stock: p.stock + (p.threshold * 2 || 10) } : p ));
        toast({ title: "Restocked!", description: `Part ${partId} stock increased.` });
      };

      const exportToCSV = () => {
        const headers = "Part ID,Name,Brand,Category,Stock,Min Threshold,Cost,Retail,Supplier,Barcode\n";
        const csvContent = "data:text/csv;charset=utf-8," + headers + filteredParts.map(p => 
          `${p.id},"${p.name}","${p.brand}","${p.category}",${p.stock},${p.threshold},${p.cost},${p.retail},"${p.supplier}","${p.barcode}"`
        ).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "werkdesk_inventory.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({title: "Exported!", description: "Inventory data exported to CSV."});
      };
      
      const inventoryStats = {
        totalParts: parts.length,
        lowStock: parts.filter(p => p.stock <= p.threshold).length,
        outOfStock: parts.filter(p => p.stock === 0).length,
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
                <Package className="mr-3 h-7 w-7 text-primary"/>Inventory Management
              </CardTitle>
              <CardDescription>Manage parts, stock levels, suppliers, and barcodes.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Parts</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{inventoryStats.totalParts}</div></CardContent>
                </Card>
                <Card className={`hover:shadow-md transition-shadow ${inventoryStats.lowStock > 0 ? 'border-orange-500 bg-orange-50' : ''}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                        <TriangleAlert className={`h-4 w-4 ${inventoryStats.lowStock > 0 ? 'text-orange-600' : 'text-muted-foreground'}`} />
                    </CardHeader>
                    <CardContent><div className={`text-2xl font-bold ${inventoryStats.lowStock > 0 ? 'text-orange-600' : ''}`}>{inventoryStats.lowStock}</div></CardContent>
                </Card>
                <Card className={`hover:shadow-md transition-shadow ${inventoryStats.outOfStock > 0 ? 'border-red-500 bg-red-50' : ''}`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
                        <ShoppingCart className={`h-4 w-4 ${inventoryStats.outOfStock > 0 ? 'text-red-600' : 'text-muted-foreground'}`} />
                    </CardHeader>
                    <CardContent><div className={`text-2xl font-bold ${inventoryStats.outOfStock > 0 ? 'text-red-600' : ''}`}>{inventoryStats.outOfStock}</div></CardContent>
                </Card>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-accent/30 rounded-lg border">
                <div className="flex-grow relative">
                  <Input 
                    placeholder="Search by Part ID, Name, Brand, Barcode..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-base"
                  />
                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-[180px] text-base"><SelectValue placeholder="Filter by Category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Screens">Screens</SelectItem>
                    <SelectItem value="Batteries">Batteries</SelectItem>
                    <SelectItem value="Keyboards">Keyboards</SelectItem>
                    <SelectItem value="Cooling">Cooling</SelectItem>
                    
                  </SelectContent>
                </Select>
                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger className="w-full md:w-[180px] text-base"><SelectValue placeholder="Filter by Supplier" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Suppliers</SelectItem>
                    <SelectItem value="ScreenSource Ltd.">ScreenSource Ltd.</SelectItem>
                    <SelectItem value="PowerUp Inc.">PowerUp Inc.</SelectItem>
                    <SelectItem value="KeyMasters">KeyMasters</SelectItem>
                    <SelectItem value="CoolParts Co.">CoolParts Co.</SelectItem>
                     
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setSupplierFilter('all'); }} className="text-base">
                  <Filter className="mr-2 h-4 w-4" /> Clear Filters
                </Button>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <Dialog open={isModalOpen} onOpenChange={(isOpen) => {
                    setIsModalOpen(isOpen);
                    if (!isOpen) {
                        setEditingPart(null);
                         setNewPartData({ name: '', brand: '', category: '', stock: '', threshold: '', cost: '', retail: '', supplier: '', barcode: ''});
                    }
                }}>
                    <DialogTrigger asChild>
                    <Button size="lg" className="text-base" onClick={() => { setEditingPart(null); setNewPartData({ name: '', brand: '', category: '', stock: '', threshold: '', cost: '', retail: '', supplier: '', barcode: ''}); setIsModalOpen(true); }}>
                        <PlusCircle className="mr-2 h-5 w-5" /> Add New Part
                    </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{editingPart ? "Edit Part" : "Add New Part"}</DialogTitle>
                        <DialogUIDescription>
                        {editingPart ? "Update details for this part." : "Fill in the details to add a new part to inventory."}
                        </DialogUIDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right text-sm">Part Name</Label>
                            <Input id="name" name="name" value={newPartData.name} onChange={handleInputChange} className="col-span-3 text-sm" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="brand" className="text-right text-sm">Brand</Label>
                            <Input id="brand" name="brand" value={newPartData.brand} onChange={handleInputChange} className="col-span-3 text-sm" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right text-sm">Category</Label>
                            <Input id="category" name="category" value={newPartData.category} onChange={handleInputChange} className="col-span-3 text-sm" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="stock" className="text-right text-sm">Stock Qty</Label>
                            <Input id="stock" name="stock" type="number" value={newPartData.stock} onChange={handleInputChange} className="col-span-3 text-sm" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="threshold" className="text-right text-sm">Min. Threshold</Label>
                            <Input id="threshold" name="threshold" type="number" value={newPartData.threshold} onChange={handleInputChange} className="col-span-3 text-sm" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="cost" className="text-right text-sm">Cost Price ($)</Label>
                            <Input id="cost" name="cost" type="number" value={newPartData.cost} onChange={handleInputChange} className="col-span-3 text-sm" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="retail" className="text-right text-sm">Retail Price ($)</Label>
                            <Input id="retail" name="retail" type="number" value={newPartData.retail} onChange={handleInputChange} className="col-span-3 text-sm" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="supplier" className="text-right text-sm">Supplier</Label>
                            <Input id="supplier" name="supplier" value={newPartData.supplier} onChange={handleInputChange} className="col-span-3 text-sm" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="barcode" className="text-right text-sm">Barcode</Label>
                            <Input id="barcode" name="barcode" value={newPartData.barcode} onChange={handleInputChange} className="col-span-3 text-sm" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
                        <Button type="submit" onClick={editingPart ? handleSaveEdit : handleSubmitPart}>{editingPart ? "Save Changes" : "Add Part"}</Button>
                    </DialogFooter>
                    </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={exportToCSV} className="text-base">
                  <FileDown className="mr-2 h-5 w-5" /> Export CSV
                </Button>
              </div>

              <div className="overflow-x-auto rounded-lg border">
                <Table>
                  <TableHeader className="bg-muted/50">
                    <TableRow>
                      {['Part ID', 'Name', 'Brand', 'Category', 'Stock', 'Min Threshold', 'Cost', 'Retail', 'Supplier', 'Barcode', 'Actions'].map(header => (
                        <TableHead key={header} className="whitespace-nowrap text-sm">{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                    {filteredParts.map((part) => (
                      <motion.tr 
                        key={part.id} 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`hover:bg-accent/50 transition-colors duration-150 ${part.stock <= part.threshold ? (part.stock === 0 ? 'bg-red-100/50 hover:bg-red-100/70' : 'bg-orange-100/50 hover:bg-orange-100/70') : ''}`}
                      >
                        <TableCell className="font-medium text-primary hover:underline cursor-pointer whitespace-nowrap text-sm">{part.id}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{part.name}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{part.brand}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{part.category}</TableCell>
                        <TableCell className={`font-semibold whitespace-nowrap text-sm ${part.stock <= part.threshold ? (part.stock === 0 ? 'text-red-600' : 'text-orange-600') : ''}`}>
                            {part.stock}
                            {part.stock <= part.threshold && <TriangleAlert className="inline ml-1 h-4 w-4"/>}
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{part.threshold}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">${part.cost.toFixed(2)}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">${part.retail.toFixed(2)}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{part.supplier}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">{part.barcode}</TableCell>
                        <TableCell className="space-x-1 whitespace-nowrap text-sm">
                          <Button variant="ghost" size="icon" onClick={() => handleRestock(part.id)} className="hover:text-green-600">
                            <ShoppingCart className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleEditPart(part)} className="hover:text-blue-600">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeletePart(part.id)} className="hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </motion.tr>
                    ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
              {filteredParts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No parts found matching your criteria.</div>
              )}
            </CardContent>
            <CardFooter className="pt-6 border-t">
                <p className="text-sm text-muted-foreground">Total Parts Shown: {filteredParts.length}</p>
            </CardFooter>
          </Card>
        </motion.div>
      );
    };
    export default InventoryPage;