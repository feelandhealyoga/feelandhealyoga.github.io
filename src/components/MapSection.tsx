import { MapPin } from "lucide-react";

export const MapSection = () => {
  return (
    <section id="map" className="py-20 px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-foreground text-center mb-8">
          Find Us
        </h2>
        <div className="flex items-center justify-center gap-2 mb-8">
          <MapPin className="w-5 h-5 text-primary" />
          <p className="text-lg text-muted-foreground">
            Feel & Heal Yoga, Kharghar, Navi Mumbai
          </p>
        </div>
        <div className="rounded-sm overflow-hidden shadow-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.654996424668!2d73.05786789999999!3d19.0349184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c3a5918f4435%3A0xf8f3dd29c69eddc0!2sFEEL%20%26%20HEAL%20YOGA!5e0!3m2!1sen!2sin!4v1763472358629!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Feel & Heal Yoga Location"
          />
        </div>
      </div>
    </section>
  );
};
