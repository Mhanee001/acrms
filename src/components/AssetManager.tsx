import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Settings,
  Camera,
  Trash2,
  Edit
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface Asset {
  id: string;
  name: string;
  asset_type: string;
  model: string | null;
  serial_number: string | null;
  manufacturer: string | null;
  purchase_date: string | null;
  warranty_expires: string | null;
  specifications: any;
  image_url: string | null;
  location: string | null;
  status: string;
  created_at: string;
}

export const AssetManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  
  const [assetForm, setAssetForm] = useState({
    name: "",
    asset_type: "",
    model: "",
    serial_number: "",
    manufacturer: "",
    purchase_date: "",
    warranty_expires: "",
    specifications: "",
    location: "",
    status: "active"
  });

  useEffect(() => {
    if (user) {
      fetchAssets();
    }
  }, [user]);

  const fetchAssets = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching assets:', error);
        return;
      }

      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setAssetForm({
      name: "",
      asset_type: "",
      model: "",
      serial_number: "",
      manufacturer: "",
      purchase_date: "",
      warranty_expires: "",
      specifications: "",
      location: "",
      status: "active"
    });
    setEditingAsset(null);
  };

  const handleSaveAsset = async () => {
    if (!user) return;

    try {
      const assetData = {
        ...assetForm,
        user_id: user.id,
        specifications: assetForm.specifications ? JSON.parse(assetForm.specifications) : null
      };

      let error;
      if (editingAsset) {
        ({ error } = await supabase
          .from('assets')
          .update(assetData)
          .eq('id', editingAsset.id));
      } else {
        ({ error } = await supabase
          .from('assets')
          .insert([assetData]));
      }

      if (error) {
        toast({
          title: "Error",
          description: "Failed to save asset",
          variant: "destructive"
        });
        return;
      }

      // Log activity
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: editingAsset ? 'update_asset' : 'create_asset',
        description: `Asset ${editingAsset ? 'updated' : 'created'}: ${assetForm.name}`,
        entity_type: 'asset',
        entity_id: editingAsset?.id
      });

      toast({
        title: "Success",
        description: `Asset ${editingAsset ? 'updated' : 'created'} successfully`
      });

      setIsDialogOpen(false);
      resetForm();
      fetchAssets();
    } catch (error) {
      console.error('Error saving asset:', error);
      toast({
        title: "Error",
        description: "Invalid specifications format",
        variant: "destructive"
      });
    }
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setAssetForm({
      name: asset.name,
      asset_type: asset.asset_type,
      model: asset.model || "",
      serial_number: asset.serial_number || "",
      manufacturer: asset.manufacturer || "",
      purchase_date: asset.purchase_date || "",
      warranty_expires: asset.warranty_expires || "",
      specifications: asset.specifications ? JSON.stringify(asset.specifications, null, 2) : "",
      location: asset.location || "",
      status: asset.status
    });
    setIsDialogOpen(true);
  };

  const handleDeleteAsset = async (assetId: string) => {
    try {
      const { error } = await supabase
        .from('assets')
        .delete()
        .eq('id', assetId);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete asset",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Asset deleted successfully"
      });

      fetchAssets();
    } catch (error) {
      console.error('Error deleting asset:', error);
    }
  };

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.asset_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || asset.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "maintenance": return "secondary";
      case "retired": return "outline";
      default: return "outline";
    }
  };

  if (loading) {
    return <div className="text-center">Loading assets...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Asset Management</h2>
          <p className="text-muted-foreground">Manage your equipment and assets</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Asset
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingAsset ? 'Edit Asset' : 'Add New Asset'}</DialogTitle>
              <DialogDescription>
                {editingAsset ? 'Update asset information' : 'Add a new asset to your inventory'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Asset Name</Label>
                  <Input
                    id="name"
                    value={assetForm.name}
                    onChange={(e) => setAssetForm({...assetForm, name: e.target.value})}
                    placeholder="e.g., Laptop Dell XPS 13"
                  />
                </div>
                <div>
                  <Label htmlFor="asset_type">Asset Type</Label>
                  <Input
                    id="asset_type"
                    value={assetForm.asset_type}
                    onChange={(e) => setAssetForm({...assetForm, asset_type: e.target.value})}
                    placeholder="e.g., Laptop, Printer, Server"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={assetForm.manufacturer}
                    onChange={(e) => setAssetForm({...assetForm, manufacturer: e.target.value})}
                    placeholder="e.g., Dell, HP, Apple"
                  />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={assetForm.model}
                    onChange={(e) => setAssetForm({...assetForm, model: e.target.value})}
                    placeholder="e.g., XPS 13 9310"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serial_number">Serial Number</Label>
                  <Input
                    id="serial_number"
                    value={assetForm.serial_number}
                    onChange={(e) => setAssetForm({...assetForm, serial_number: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={assetForm.location}
                    onChange={(e) => setAssetForm({...assetForm, location: e.target.value})}
                    placeholder="e.g., Office Floor 2, Room 201"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="purchase_date">Purchase Date</Label>
                  <Input
                    id="purchase_date"
                    type="date"
                    value={assetForm.purchase_date}
                    onChange={(e) => setAssetForm({...assetForm, purchase_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="warranty_expires">Warranty Expires</Label>
                  <Input
                    id="warranty_expires"
                    type="date"
                    value={assetForm.warranty_expires}
                    onChange={(e) => setAssetForm({...assetForm, warranty_expires: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={assetForm.status} onValueChange={(value) => setAssetForm({...assetForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="specifications">Specifications (JSON)</Label>
                <Textarea
                  id="specifications"
                  rows={4}
                  value={assetForm.specifications}
                  onChange={(e) => setAssetForm({...assetForm, specifications: e.target.value})}
                  placeholder='{"CPU": "Intel i7", "RAM": "16GB", "Storage": "512GB SSD"}'
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveAsset}>
                  {editingAsset ? 'Update Asset' : 'Add Asset'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground text-lg">No assets found</div>
            <p className="text-sm text-muted-foreground mt-2">Add your first asset to get started</p>
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <Card key={asset.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{asset.name}</CardTitle>
                    <CardDescription>{asset.asset_type}</CardDescription>
                  </div>
                  <Badge variant={getStatusColor(asset.status) as any}>
                    {asset.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {asset.manufacturer && (
                  <div className="text-sm">
                    <span className="font-medium">Manufacturer:</span> {asset.manufacturer}
                  </div>
                )}
                {asset.model && (
                  <div className="text-sm">
                    <span className="font-medium">Model:</span> {asset.model}
                  </div>
                )}
                {asset.serial_number && (
                  <div className="text-sm">
                    <span className="font-medium">Serial:</span> {asset.serial_number}
                  </div>
                )}
                {asset.location && (
                  <div className="flex items-center space-x-1 text-sm">
                    <MapPin className="h-3 w-3" />
                    <span>{asset.location}</span>
                  </div>
                )}
                {asset.warranty_expires && (
                  <div className="flex items-center space-x-1 text-sm">
                    <Calendar className="h-3 w-3" />
                    <span>Warranty: {new Date(asset.warranty_expires).toLocaleDateString()}</span>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleEditAsset(asset)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDeleteAsset(asset.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};