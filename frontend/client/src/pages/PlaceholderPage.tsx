import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction } from "lucide-react";
import DashboardLayout from "../components/DashboardLayout";

export default function PlaceholderPage({ title, description }: { title: string, description: string }) {
  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col items-center justify-center h-[80vh] p-8">
        <Card className="w-full max-w-md border-dashed border-2 bg-muted/30">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
              <Construction className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            This module is currently under active development. Check back soon for updates!
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
