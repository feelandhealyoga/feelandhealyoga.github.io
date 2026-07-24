import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

export const InstagramSection = () => {
  return (
    <section id="instagram" className="py-20 px-6 bg-background">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
          Follow Our Journey
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Get daily inspiration, pose tutorials, and wellness tips on Instagram. 
          Join our vibrant community and stay connected with the latest classes and events.
        </p>
        <div className="mb-12">
          <Button 
            size="lg"
            className="gap-2 bg-primary hover:bg-primary/90"
            onClick={() => window.open('https://www.instagram.com/feelandhealyoga/', '_blank')}
          >
            <Instagram className="w-5 h-5" />
            Follow @feelandhealyoga
          </Button>
        </div>

      </div>
    </section>
  );
};
