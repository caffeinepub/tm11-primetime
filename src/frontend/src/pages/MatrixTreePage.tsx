import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, User as UserIcon } from "lucide-react";
import { type MatrixNode, buildMatrixTree } from "../store";
import type { User } from "../types";

interface MatrixTreePageProps {
  user: User;
}

function MatrixNodeCard({
  node,
  currentUserId,
  depth,
}: { node: MatrixNode; currentUserId: string; depth: number }) {
  const isSelf = node.user?.id === currentUserId;
  const isEmpty = node.user === null;
  const isApproved = node.user?.status === "approved";

  const nodeClass = isSelf
    ? "matrix-node-self"
    : isEmpty
      ? "matrix-node-empty"
      : "matrix-node-filled";

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <div
        className={`${nodeClass} rounded-xl p-3 w-28 text-center relative`}
        data-ocid={`matrix.item.${depth + 1}`}
      >
        {isSelf && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <Badge className="gold-gradient text-background border-0 text-xs px-1.5 py-0">
              You
            </Badge>
          </div>
        )}
        <div
          className={`w-8 h-8 rounded-full mx-auto mb-1.5 flex items-center justify-center ${isEmpty ? "bg-secondary/30" : isSelf ? "gold-gradient" : "bg-primary/20"}`}
        >
          {isEmpty ? (
            <UserIcon className="w-4 h-4 text-muted-foreground" />
          ) : (
            <UserIcon className="w-4 h-4 text-primary" />
          )}
        </div>
        <div
          className={`text-xs font-semibold truncate ${isEmpty ? "text-muted-foreground" : isSelf ? "text-primary" : "text-foreground"}`}
        >
          {isEmpty ? "Empty" : node.user!.name.split(" ")[0]}
        </div>
        {!isEmpty && (
          <div
            className={`text-xs mt-0.5 ${isApproved ? "text-green-400" : "text-yellow-500/80"}`}
          >
            {isApproved ? "● Active" : "○ Pending"}
          </div>
        )}
        {!isEmpty && node.user!.matrixLevel && (
          <div className="text-xs text-muted-foreground">
            Lvl {node.user!.matrixLevel}
          </div>
        )}
      </div>

      {/* Children connector + children */}
      {depth < 2 && node.children.length > 0 && (
        <div className="flex flex-col items-center mt-2">
          {/* Vertical line down */}
          <div className="w-px h-4 bg-border" />
          {/* Horizontal line spanning children */}
          <div className="relative flex items-start">
            {/* Horizontal connecting line */}
            <div
              className="absolute top-0 left-0 right-0 h-px bg-border"
              style={{ top: "0px" }}
            />
            <div className="flex gap-3 md:gap-6 pt-4">
              {node.children.map((child, childIdx) => (
                <div
                  key={child.user?.id ?? `empty-${depth}-${childIdx}`}
                  className="flex flex-col items-center"
                >
                  {/* Short vertical from horizontal line to node */}
                  <div className="w-px h-2 bg-border" />
                  <MatrixNodeCard
                    node={child}
                    currentUserId={currentUserId}
                    depth={depth + 1}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function MatrixTreePage({ user }: MatrixTreePageProps) {
  const matrixTree = buildMatrixTree(user.id);

  // Count stats
  const allUsers: User[] = [];
  function collectUsers(node: MatrixNode) {
    if (node.user) allUsers.push(node.user);
    node.children.forEach(collectUsers);
  }
  collectUsers(matrixTree);

  const directReferrals = matrixTree.children.filter(
    (c) => c.user !== null,
  ).length;
  const totalNetwork = allUsers.length - 1; // exclude self
  const activeMembers = allUsers.filter(
    (u) => u.status === "approved" && u.id !== user.id,
  ).length;

  return (
    <div className="container py-8 space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold mb-1">
          Your Matrix Tree
        </h1>
        <p className="text-muted-foreground">
          Your 3×3 network visualization — 3 levels, 3 children each
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Direct Referrals", value: directReferrals, max: 3 },
          { label: "Total Network", value: totalNetwork, max: 13 },
          { label: "Active Members", value: activeMembers, max: totalNetwork },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="dark-card text-center"
            data-ocid="matrix.card"
          >
            <CardContent className="p-4">
              <div className="font-display text-3xl font-bold gold-text">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground/50">
                of {stat.max} max
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {[
          { label: "You", cls: "matrix-node-self w-4 h-4 rounded" },
          { label: "Active Member", cls: "matrix-node-filled w-4 h-4 rounded" },
          { label: "Empty Slot", cls: "matrix-node-empty w-4 h-4 rounded" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={item.cls} />
            <span className="text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Matrix tree */}
      <Card className="dark-card overflow-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Network className="w-5 h-5 text-primary" />
            3×3 Matrix Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8 overflow-x-auto min-w-0">
            <div className="w-full min-w-max px-4">
              <MatrixNodeCard
                node={matrixTree}
                currentUserId={user.id}
                depth={0}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Commission info */}
      <Card className="dark-card">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded gold-gradient flex items-center justify-center">
              <span className="text-xs font-bold text-background">₹</span>
            </div>
            <span className="font-semibold">Matrix Commission Structure</span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { level: "Level 1", earn: "₹10", note: "Direct referral" },
              { level: "Level 2", earn: "₹5", note: "Indirect referral" },
              { level: "Level 3", earn: "₹3", note: "Third-tier" },
            ].map((item) => (
              <div key={item.level} className="bg-secondary/30 rounded-lg p-3">
                <div className="text-xs text-muted-foreground">
                  {item.level}
                </div>
                <div className="font-display text-xl font-bold gold-text">
                  {item.earn}
                </div>
                <div className="text-xs text-muted-foreground">{item.note}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
