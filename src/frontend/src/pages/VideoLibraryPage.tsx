import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Play, Video } from "lucide-react";
import { useState } from "react";
import { getVideos } from "../store";
import type { User, VideoCategory } from "../types";

interface VideoLibraryPageProps {
  user: User;
}

const CATEGORIES: VideoCategory[] = [
  "Tutorial",
  "Tourism",
  "Devotional",
  "Entertainment",
  "Education",
  "Wellness",
];

const CATEGORY_ICONS: Record<VideoCategory, string> = {
  Tutorial: "📖",
  Tourism: "✈️",
  Devotional: "🙏",
  Entertainment: "🎭",
  Education: "🎓",
  Wellness: "🧘",
};

export function VideoLibraryPage({ user }: VideoLibraryPageProps) {
  const [activeCategory, setActiveCategory] =
    useState<VideoCategory>("Tutorial");
  const videos = getVideos();
  const isApproved = user.status === "approved";

  if (!isApproved) {
    return (
      <div
        className="container py-12 max-w-lg text-center"
        data-ocid="video.empty_state"
      >
        <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="font-display text-2xl font-bold mb-3">
          Premium Content Locked
        </h2>
        <p className="text-muted-foreground mb-6">
          Your account is pending admin approval. Once your payment is verified
          and your account is activated, you'll have full access to all 6 video
          categories.
        </p>
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="bg-secondary/30 rounded-lg p-3 text-center opacity-50"
            >
              <div className="text-2xl mb-1">{CATEGORY_ICONS[cat]}</div>
              <div className="text-xs text-muted-foreground">{cat}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const filteredVideos = videos.filter((v) => v.category === activeCategory);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-1">
            Premium Video Library
          </h1>
          <p className="text-muted-foreground">
            Exclusive content across 6 categories — for active members only
          </p>
        </div>
        <Badge className="gold-gradient text-background border-0">
          <Video className="w-3 h-3 mr-1" />
          {videos.length} Videos
        </Badge>
      </div>

      <Tabs
        value={activeCategory}
        onValueChange={(val) => setActiveCategory(val as VideoCategory)}
      >
        <div className="overflow-x-auto">
          <TabsList className="bg-secondary/50 h-auto p-1 gap-1 flex w-max min-w-full md:min-w-0">
            {CATEGORIES.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="flex items-center gap-1.5 text-xs md:text-sm px-3 py-2 data-[state=active]:gold-gradient data-[state=active]:text-background data-[state=active]:font-bold"
                data-ocid="video.tab"
              >
                <span>{CATEGORY_ICONS[cat]}</span>
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {CATEGORIES.map((cat) => (
          <TabsContent key={cat} value={cat} className="mt-6">
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12" data-ocid="video.empty_state">
                <Video className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No videos in this category yet.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredVideos.map((video, i) => (
                  <Card
                    key={video.id}
                    className="dark-card overflow-hidden group hover:gold-border transition-all cursor-pointer"
                    data-ocid={`video.item.${i + 1}`}
                  >
                    <div className="relative aspect-video overflow-hidden bg-secondary">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center">
                          <Play
                            className="w-5 h-5 text-background ml-0.5"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge className="gold-gradient text-background border-0 text-xs">
                          {CATEGORY_ICONS[video.category]} {video.category}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1.5">
                        {video.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {video.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
