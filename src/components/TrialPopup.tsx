import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
const poseImage = "/assets/pose-warrior.png";

export const TrialPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    // Auto-popup disabled — users book via the Yogi chatbot or hero CTA
    // const timer = setTimeout(() => setShowPopup(true), 45000);
    // return () => clearTimeout(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi! I want a free trial class.%0AName: ${formData.name}%0ADescription: ${formData.description}`;
    window.open(
      `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || "919920155875"}?text=${text}`,
      "_blank",
    );
    setShowPopup(false);
  };

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2">
            <img
              src={poseImage}
              alt="Warrior Pose"
              width="32"
              height="32"
              loading="lazy"
              className="w-8 h-8 rounded-sm"
            />
            Ready for Your Free Trial?
          </DialogTitle>
          <DialogDescription className="text-left">
            Experience a free yoga class and feel the difference from Day 1.
            <br />
            <br />
            <strong>Benefits You'll Love:</strong>
            <br />
            • Weight loss & flexibility
            <br />
            • Stress & anxiety relief
            <br />
            • Back pain & stiffness reduction
            <br />• Beginner-friendly, calm & positive sessions
          </DialogDescription>
          <form
            id="trial-form"
            onSubmit={handleSubmit}
            className="space-y-4 pt-5"
          >
            <Input
              placeholder="Your Name *"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Textarea
              placeholder="Tell us about your yoga experience and goals..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              className="min-h-[80px]"
            />
          </form>
        </DialogHeader>
        <DialogFooter className="flex justify-center gap-2">
          <Button variant="outline" onClick={() => setShowPopup(false)}>
            Maybe Later
          </Button>
          <Button
            type="submit"
            form="trial-form"
            className="bg-green-500 hover:bg-green-600"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message on WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
