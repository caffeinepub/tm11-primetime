import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Video as VideoIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { generateId, getVideos, saveVideos } from "../store";
import type { Video, VideoCategory } from "../types";

const CATEGORIES: VideoCategory[] = [
  "Tutorial",
  "Tourism",
  "Devotional",
  "Entertainment",
  "Education",
  "Wellness",
];

export function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>(() => getVideos());
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<VideoCategory>("Tutorial");
  const [url, setUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [description, setDescription] = useState("");

  function refresh() {
    setVideos(getVideos());
  }

  function handleAdd() {
    if (!title.trim() || !category) {
      toast.error("Title and category are required");
      return;
    }

    const allVideos = getVideos();
    const newVideo: Video = {
      id: generateId(),
      title: title.trim(),
      category,
      url: url.trim() || "#",
      thumbnail:
        thumbnail.trim() ||
        `https://picsum.photos/seed/${generateId()}/320/180`,
      description: description.trim(),
    };
    saveVideos([...allVideos, newVideo]);
    setTitle("");
    setUrl("");
    setThumbnail("");
    setDescription("");
    refresh();
    toast.success(`"${newVideo.title}" added to ${category}!`);
  }

  function handleRemove(id: string) {
    const updated = getVideos().filter((v) => v.id !== id);
    saveVideos(updated);
    refresh();
    toast.success("Video removed.");
  }

  const videosByCategory = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat] = videos.filter((v) => v.category === cat);
      return acc;
    },
    {} as Record<VideoCategory, Video[]>,
  );

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">
          Video Library Manager
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {videos.length} videos across {CATEGORIES.length} categories
        </p>
      </div>

      {/* Add Video Form */}
      <Card className="dark-card gold-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Add New Video
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Video Title *</Label>
            <Input
              placeholder="Enter video title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-input"
              data-ocid="admin_videos.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Category *</Label>
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as VideoCategory)}
            >
              <SelectTrigger
                className="bg-input"
                data-ocid="admin_videos.input"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Video URL</Label>
            <Input
              placeholder="https://youtube.com/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="bg-input"
              data-ocid="admin_videos.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Thumbnail URL</Label>
            <Input
              placeholder="https://... (leave empty for auto)"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="bg-input"
              data-ocid="admin_videos.input"
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Brief description of the video..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-input resize-none h-20"
              data-ocid="admin_videos.input"
            />
          </div>

          <div className="md:col-span-2">
            <Button
              className="gold-gradient text-background font-bold"
              onClick={handleAdd}
              data-ocid="admin_videos.submit_button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Videos by category */}
      {CATEGORIES.map((cat) => (
        <div key={cat}>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="font-semibold text-lg">{cat}</h2>
            <span className="text-xs text-muted-foreground bg-secondary/50 rounded-full px-2 py-0.5">
              {videosByCategory[cat].length} videos
            </span>
          </div>

          {videosByCategory[cat].length === 0 ? (
            <div className="text-center py-6 dark-card rounded-xl text-muted-foreground text-sm">
              No videos in {cat} yet.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {videosByCategory[cat].map((video, i) => (
                <div
                  key={video.id}
                  className="dark-card rounded-xl overflow-hidden"
                >
                  <div className="aspect-video bg-secondary relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            className="h-7 w-7 p-0 bg-destructive/80 hover:bg-destructive"
                            data-ocid={`admin_videos.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="dark-card gold-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove Video</AlertDialogTitle>
                            <AlertDialogDescription>
                              Remove "{video.title}"? This cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel data-ocid="admin_videos.cancel_button">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground"
                              onClick={() => handleRemove(video.id)}
                              data-ocid="admin_videos.confirm_button"
                            >
                              Remove
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="text-sm font-medium line-clamp-1">
                      {video.title}
                    </div>
                    {video.description && (
                      <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                        {video.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {videos.length === 0 && (
        <div className="text-center py-12" data-ocid="admin_videos.empty_state">
          <VideoIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No videos added yet.</p>
        </div>
      )}
    </div>
  );
}
