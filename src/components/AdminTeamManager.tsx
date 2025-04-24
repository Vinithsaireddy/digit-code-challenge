
import React, { useState } from "react";
import { useGame, Team } from "@/contexts/GameContext";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

const AdminTeamManager: React.FC = () => {
  const { teams, addTeam, updateTeam, deleteTeam } = useGame();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  
  const [newTeamName, setNewTeamName] = useState<string>("");
  const [newTeamCode, setNewTeamCode] = useState<string>("");

  const resetForm = () => {
    setNewTeamName("");
    setNewTeamCode("");
    setEditingTeam(null);
  };

  const handleAddTeam = () => {
    if (newTeamName.trim() && newTeamCode.trim()) {
      addTeam({
        name: newTeamName.trim(),
        code: newTeamCode.trim(),
      });
      setIsAddDialogOpen(false);
      resetForm();
    }
  };

  const handleEditTeam = () => {
    if (editingTeam && newTeamName.trim() && newTeamCode.trim()) {
      updateTeam(editingTeam.id, {
        name: newTeamName.trim(),
        code: newTeamCode.trim(),
      });
      setIsEditDialogOpen(false);
      resetForm();
    }
  };

  const openEditDialog = (team: Team) => {
    setEditingTeam(team);
    setNewTeamName(team.name);
    setNewTeamCode(team.code);
    setIsEditDialogOpen(true);
  };

  const validateCode = (code: string) => {
    // Check if code is 6 digits
    return /^\d{6}$/.test(code);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Team Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-game-neon-cyan text-black hover:bg-game-neon-cyan/80"
              onClick={() => resetForm()}
            >
              Add Team
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-game-dark-surface border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Team</DialogTitle>
              <DialogDescription className="text-gray-400">
                Create a new team with a 6-digit code.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="team-name" className="text-white">
                  Team Name
                </Label>
                <Input
                  id="team-name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="col-span-3 bg-game-dark-card text-white border-gray-700"
                  placeholder="Enter team name..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label 
                  htmlFor="team-code" 
                  className="text-white"
                >
                  Team Code
                </Label>
                <div className="col-span-3 space-y-2">
                  <Input
                    id="team-code"
                    value={newTeamCode}
                    onChange={(e) => setNewTeamCode(e.target.value)}
                    className="bg-game-dark-card text-white border-gray-700"
                    placeholder="6-digit code..."
                    maxLength={6}
                  />
                  {newTeamCode && !validateCode(newTeamCode) && (
                    <p className="text-red-500 text-sm">Code must be exactly 6 digits</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddTeam}
                disabled={!newTeamName.trim() || !validateCode(newTeamCode)}
              >
                Create Team
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-game-dark-surface border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Team</DialogTitle>
              <DialogDescription className="text-gray-400">
                Update team information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-team-name" className="text-white">
                  Team Name
                </Label>
                <Input
                  id="edit-team-name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="col-span-3 bg-game-dark-card text-white border-gray-700"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-team-code" className="text-white">
                  Team Code
                </Label>
                <div className="col-span-3 space-y-2">
                  <Input
                    id="edit-team-code"
                    value={newTeamCode}
                    onChange={(e) => setNewTeamCode(e.target.value)}
                    className="bg-game-dark-card text-white border-gray-700"
                    maxLength={6}
                  />
                  {newTeamCode && !validateCode(newTeamCode) && (
                    <p className="text-red-500 text-sm">Code must be exactly 6 digits</p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleEditTeam}
                disabled={!newTeamName.trim() || !validateCode(newTeamCode)}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Table className="border border-gray-800">
        <TableCaption className="text-gray-400">Manage your teams and their codes</TableCaption>
        <TableHeader className="bg-game-dark-card">
          <TableRow>
            <TableHead className="text-white">Team Name</TableHead>
            <TableHead className="text-white">Team Code</TableHead>
            <TableHead className="text-white text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teams.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500">
                No teams found. Add a team to get started.
              </TableCell>
            </TableRow>
          ) : (
            teams.map((team) => (
              <TableRow key={team.id} className="border-gray-800">
                <TableCell className="font-medium text-white">{team.name}</TableCell>
                <TableCell className="font-mono text-game-neon-cyan">{team.code}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(team)}
                      className="border-gray-700 text-gray-300 hover:text-white"
                    >
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-game-dark-surface border-gray-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">Delete Team</AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-400">
                            Are you sure you want to delete {team.name}? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => deleteTeam(team.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminTeamManager;
