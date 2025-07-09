import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Monitor, Cpu, HardDrive, Smartphone } from "lucide-react";

const devices = [
  {
    id: "DEV-001",
    name: "MacBook Pro 16" ,
    type: "Laptop",
    brand: "Apple",
    model: "A2141",
    serial: "C02ZK0XXXXXX",
    specs: {
      cpu: "Intel Core i9",
      ram: "32GB DDR4",
      storage: "1TB SSD",
      os: "macOS Ventura"
    }
  },
  {
    id: "DEV-002",
    name: "iPhone 13 Pro",
    type: "Smartphone",
    brand: "Apple",
    model: "A2636",
    serial: "F2LZK1XXXXXX",
    specs: {
      cpu: "A15 Bionic",
      ram: "6GB",
      storage: "256GB",
      os: "iOS 17"
    }
  }
];

const iconForType = (type: string) => {
  switch (type) {
    case "Laptop": return <Monitor className="h-6 w-6 text-primary" />;
    case "Smartphone": return <Smartphone className="h-6 w-6 text-primary" />;
    case "Desktop": return <Cpu className="h-6 w-6 text-primary" />;
    case "Storage": return <HardDrive className="h-6 w-6 text-primary" />;
    default: return <Monitor className="h-6 w-6 text-primary" />;
  }
};

const Device = () => {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Devices</h1>
        <p className="text-muted-foreground">View all your registered devices and their specifications.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {devices.map(device => (
          <Card key={device.id} className="hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              {iconForType(device.type)}
              <div>
                <CardTitle>{device.name}</CardTitle>
                <CardDescription>{device.brand} {device.model} &bull; SN: {device.serial}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><span className="font-medium text-foreground">CPU:</span> {device.specs.cpu}</li>
                <li><span className="font-medium text-foreground">RAM:</span> {device.specs.ram}</li>
                <li><span className="font-medium text-foreground">Storage:</span> {device.specs.storage}</li>
                <li><span className="font-medium text-foreground">OS:</span> {device.specs.os}</li>
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Device; 