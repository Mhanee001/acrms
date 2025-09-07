import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Search, 
  Filter,
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Eye,
  Grid3X3,
  Table as TableIcon,
  Edit,
  Trash2,
  Download,
  Upload,
  BarChart3,
  ShoppingCart,
  Truck,
  ArrowUpDown,
  Calendar,
  FileText,
  Settings,
  History
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface InventoryItem {
  id: string;
  name: string;
  description: string | null;
  category: string;
  quantity: number;
  min_stock_level: number;
  unit_price: number;
  supplier: string | null;
  location: string | null;
  status: string;
  last_updated: string;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

interface StockMovement {
  id: string;
  inventory_item_id: string;
  movement_type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  unit_price?: number;
  reference_number?: string;
  notes?: string;
  created_at: string;
  created_by: string;
  inventory_item?: {
    name: string;
  };
}

interface PurchaseOrder {
  id: string;
  po_number: string;
  supplier: string;
  status: 'pending' | 'approved' | 'received' | 'cancelled';
  total_amount: number;
  created_at: string;
  expected_delivery?: string;
  notes?: string;
}

export const InventoryManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [activeTab, setActiveTab] = useState("inventory");
  
  // Dialogs
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isStockMovementOpen, setIsStockMovementOpen] = useState(false);
  const [isPurchaseOrderOpen, setIsPurchaseOrderOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // Form states
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    category: "",
    quantity: 0,
    min_stock_level: 0,
    unit_price: 0,
    supplier: "",
    location: ""
  });

  const [movementForm, setMovementForm] = useState({
    inventory_item_id: "",
    movement_type: "IN" as const,
    quantity: 0,
    unit_price: 0,
    reference_number: "",
    notes: ""
  });

  const [poForm, setPOForm] = useState({
    supplier: "",
    expected_delivery: "",
    notes: "",
    items: [] as Array<{ inventory_item_id: string; quantity: number; unit_price: number; }>
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchInventory(),
      fetchStockMovements(),
      fetchPurchaseOrders()
    ]);
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching inventory:', error);
        return;
      }

      // Update stock status based on quantity vs min_stock_level
      const itemsWithStatus = (data || []).map(item => ({
        ...item,
        status: item.quantity === 0 ? 'out_of_stock' : 
                item.quantity <= item.min_stock_level ? 'low_stock' : 
                'in_stock'
      }));

      setItems(itemsWithStatus);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStockMovements = async () => {
    // Since we don't have a stock_movements table yet, this will be empty
    // We'll create this table in the database if needed
    setMovements([]);
  };

  const fetchPurchaseOrders = async () => {
    // Since we don't have a purchase_orders table yet, this will be empty
    // We'll create this table in the database if needed
    setPurchaseOrders([]);
  };

  const handleAddItem = async () => {
    if (!itemForm.name || !itemForm.category) {
      toast({ 
        title: 'Missing fields', 
        description: 'Please fill name and category.', 
        variant: 'destructive' 
      });
      return;
    }

    const payload = {
      ...itemForm,
      status: itemForm.quantity > 0 ? 'in_stock' : 'out_of_stock'
    };

    const { error } = await supabase
      .from('inventory')
      .insert(payload);

    if (error) {
      console.error('Error adding inventory item:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to add item.', 
        variant: 'destructive' 
      });
      return;
    }

    toast({ 
      title: 'Item Added', 
      description: 'New inventory item has been added successfully.' 
    });
    
    fetchInventory();
    resetItemForm();
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;

    const { error } = await supabase
      .from('inventory')
      .update(itemForm)
      .eq('id', editingItem.id);

    if (error) {
      console.error('Error updating inventory item:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to update item.', 
        variant: 'destructive' 
      });
      return;
    }

    toast({ 
      title: 'Item Updated', 
      description: 'Inventory item has been updated successfully.' 
    });
    
    fetchInventory();
    resetItemForm();
    setEditingItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting inventory item:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to delete item.', 
        variant: 'destructive' 
      });
      return;
    }

    toast({ 
      title: 'Item Deleted', 
      description: 'Inventory item has been deleted successfully.' 
    });
    
    fetchInventory();
  };

  const handleStockAdjustment = async () => {
    if (!movementForm.inventory_item_id || movementForm.quantity === 0) {
      toast({ 
        title: 'Missing fields', 
        description: 'Please select item and enter quantity.', 
        variant: 'destructive' 
      });
      return;
    }

    // Update inventory quantity
    const item = items.find(i => i.id === movementForm.inventory_item_id);
    if (!item) return;

    const newQuantity = movementForm.movement_type === 'IN' ? 
      item.quantity + movementForm.quantity : 
      Math.max(0, item.quantity - movementForm.quantity);

    const { error } = await supabase
      .from('inventory')
      .update({ quantity: newQuantity })
      .eq('id', movementForm.inventory_item_id);

    if (error) {
      console.error('Error updating stock:', error);
      toast({ 
        title: 'Error', 
        description: 'Failed to adjust stock.', 
        variant: 'destructive' 
      });
      return;
    }

    toast({ 
      title: 'Stock Adjusted', 
      description: `Stock ${movementForm.movement_type === 'IN' ? 'increased' : 'decreased'} successfully.` 
    });
    
    fetchInventory();
    resetMovementForm();
  };

  const resetItemForm = () => {
    setItemForm({
      name: "",
      description: "",
      category: "",
      quantity: 0,
      min_stock_level: 0,
      unit_price: 0,
      supplier: "",
      location: ""
    });
    setIsAddItemOpen(false);
  };

  const resetMovementForm = () => {
    setMovementForm({
      inventory_item_id: "",
      movement_type: "IN",
      quantity: 0,
      unit_price: 0,
      reference_number: "",
      notes: ""
    });
    setIsStockMovementOpen(false);
  };

  const startEditItem = (item: InventoryItem) => {
    setItemForm({
      name: item.name,
      description: item.description || "",
      category: item.category,
      quantity: item.quantity,
      min_stock_level: item.min_stock_level,
      unit_price: item.unit_price,
      supplier: item.supplier || "",
      location: item.location || ""
    });
    setEditingItem(item);
    setIsAddItemOpen(true);
  };

  const exportData = () => {
    const dataToExport = {
      inventory: items,
      movements: movements,
      purchase_orders: purchaseOrders,
      exported_at: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Inventory data exported successfully"
    });
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.supplier || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in_stock": return "default";
      case "low_stock": return "secondary";
      case "out_of_stock": return "destructive";
      default: return "outline";
    }
  };

  const categories = [...new Set(items.map(item => item.category))];
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const lowStockItems = items.filter(item => item.status === 'low_stock' || item.status === 'out_of_stock');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Inventory Management System</h2>
          <p className="text-muted-foreground">Complete inventory tracking and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Item' : 'Add New Item'}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                      placeholder="Item name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Input
                      id="category"
                      value={itemForm.category}
                      onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                      placeholder="e.g., Electronics, Office Supplies"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                    placeholder="Item description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={itemForm.quantity}
                      onChange={(e) => setItemForm({ ...itemForm, quantity: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="min_stock">Min Stock Level</Label>
                    <Input
                      id="min_stock"
                      type="number"
                      value={itemForm.min_stock_level}
                      onChange={(e) => setItemForm({ ...itemForm, min_stock_level: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unit_price">Unit Price</Label>
                    <Input
                      id="unit_price"
                      type="number"
                      step="0.01"
                      value={itemForm.unit_price}
                      onChange={(e) => setItemForm({ ...itemForm, unit_price: Number(e.target.value) })}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      value={itemForm.supplier}
                      onChange={(e) => setItemForm({ ...itemForm, supplier: e.target.value })}
                      placeholder="Supplier name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={itemForm.location}
                      onChange={(e) => setItemForm({ ...itemForm, location: e.target.value })}
                      placeholder="Storage location"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => {
                    resetItemForm();
                    setEditingItem(null);
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={editingItem ? handleUpdateItem : handleAddItem}>
                    {editingItem ? 'Update' : 'Add'} Item
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">
              Unique products
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Inventory worth
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">
              Items need attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Product categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-4">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="movements">Stock Movements</TabsTrigger>
            <TabsTrigger value="orders">Purchase Orders</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Dialog open={isStockMovementOpen} onOpenChange={setIsStockMovementOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Stock Movement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Stock Movement</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Select Item</Label>
                    <Select 
                      value={movementForm.inventory_item_id} 
                      onValueChange={(value) => setMovementForm({ ...movementForm, inventory_item_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose inventory item" />
                      </SelectTrigger>
                      <SelectContent>
                        {items.map(item => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.name} (Current: {item.quantity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Movement Type</Label>
                      <Select 
                        value={movementForm.movement_type} 
                        onValueChange={(value) => setMovementForm({ ...movementForm, movement_type: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IN">Stock In</SelectItem>
                          <SelectItem value="OUT">Stock Out</SelectItem>
                          <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Quantity</Label>
                      <Input
                        type="number"
                        value={movementForm.quantity}
                        onChange={(e) => setMovementForm({ ...movementForm, quantity: Number(e.target.value) })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Reference/Notes</Label>
                    <Textarea
                      value={movementForm.notes}
                      onChange={(e) => setMovementForm({ ...movementForm, notes: e.target.value })}
                      placeholder="Add reference number or notes"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={resetMovementForm}>Cancel</Button>
                    <Button onClick={handleStockAdjustment}>Record Movement</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 flex-1 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search inventory..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="low_stock">Low Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                  >
                    <TableIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Display */}
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="text-muted-foreground text-lg">Loading inventory...</div>
                </div>
              </CardContent>
            </Card>
          ) : filteredItems.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="text-muted-foreground text-lg">No inventory items found</div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Try adjusting your search criteria or add new items.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : viewMode === 'table' ? (
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Min Stock</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Total Value</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-muted-foreground truncate max-w-xs">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
                        <TableCell className={item.quantity <= item.min_stock_level ? 'text-destructive font-medium' : ''}>
                          {item.quantity}
                        </TableCell>
                        <TableCell>{item.min_stock_level}</TableCell>
                        <TableCell>{formatCurrency(item.unit_price)}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(item.quantity * item.unit_price)}
                        </TableCell>
                        <TableCell>{item.supplier || 'N/A'}</TableCell>
                        <TableCell>{item.location || 'N/A'}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(item.status) as any}>
                            {item.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => startEditItem(item)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge variant={getStatusColor(item.status) as any}>
                        {item.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    {item.description && (
                      <CardDescription className="line-clamp-2">
                        {item.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Quantity:</span>
                      <span className={`font-medium ${item.quantity <= item.min_stock_level ? 'text-destructive' : ''}`}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Min Stock:</span>
                      <span className="font-medium">{item.min_stock_level}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Unit Price:</span>
                      <span className="font-medium">{formatCurrency(item.unit_price)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Value:</span>
                      <span className="font-bold">{formatCurrency(item.quantity * item.unit_price)}</span>
                    </div>
                    {item.supplier && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Supplier:</span>
                        <span className="text-sm">{item.supplier}</span>
                      </div>
                    )}
                    {item.location && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Location:</span>
                        <span className="text-sm">{item.location}</span>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => startEditItem(item)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Stock Movements Tab */}
        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stock Movement History</CardTitle>
              <CardDescription>
                Track all inventory movements and adjustments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-muted-foreground text-lg">Stock movements will appear here</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Record stock movements using the "Stock Movement" button above.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Purchase Orders Tab */}
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Purchase Orders</CardTitle>
                  <CardDescription>
                    Manage purchase orders and supplier relationships
                  </CardDescription>
                </div>
                <Button>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  New Purchase Order
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <div className="text-muted-foreground text-lg">No purchase orders yet</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Create purchase orders to manage supplier orders and deliveries.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Inventory Value Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span className="font-medium">{items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Value:</span>
                    <span className="font-bold">{formatCurrency(totalValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg. Item Value:</span>
                    <span className="font-medium">
                      {formatCurrency(items.length > 0 ? totalValue / items.length : 0)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Stock Alert Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>In Stock:</span>
                    <span className="font-medium text-green-600">
                      {items.filter(i => i.status === 'in_stock').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Low Stock:</span>
                    <span className="font-medium text-yellow-600">
                      {items.filter(i => i.status === 'low_stock').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Out of Stock:</span>
                    <span className="font-medium text-red-600">
                      {items.filter(i => i.status === 'out_of_stock').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Category Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span className="font-medium">{categories.length}</span>
                  </div>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {categories.map(category => (
                      <div key={category} className="flex justify-between text-sm">
                        <span className="truncate">{category}:</span>
                        <span className="font-medium ml-2">
                          {items.filter(i => i.category === category).length}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};