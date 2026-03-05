import { Crown, Heart } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname = window.location.hostname;
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md gold-gradient flex items-center justify-center">
            <Crown className="w-3 h-3 text-background" />
          </div>
          <span className="font-display font-bold text-sm gold-text">
            TM11 PrimeTime
          </span>
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          © {year}. Built with{" "}
          <Heart className="w-3 h-3 text-red-500 fill-red-500 inline" /> using{" "}
          <a
            href={caffeineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            caffeine.ai
          </a>
        </p>
        <div className="text-xs text-muted-foreground">
          UPI: <span className="text-primary font-mono">tm11primetime@upi</span>
        </div>
      </div>
    </footer>
  );
}
