
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Edit, UserPlus, UserMinus } from "lucide-react";
import { useFamilyStore, FamilyMember } from '@/services/familyService';

const Admin: React.FC = () => {
  const { members, addMember, updateMember, deleteMember } = useFamilyStore();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<FamilyMember | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<FamilyMember | null>(null);

  // Open dialog to add a new member
  const handleAddMember = () => {
    setCurrentMember({ id: '', name: '', role: 'Child', color: '#9b87f5' });
    setIsDialogOpen(true);
  };

  // Open dialog to edit an existing member
  const handleEditMember = (member: FamilyMember) => {
    setCurrentMember({ ...member });
    setIsDialogOpen(true);
  };

  // Open confirmation dialog to delete a member
  const handleDeletePrompt = (member: FamilyMember) => {
    setMemberToDelete(member);
    setIsDeleteDialogOpen(true);
  };

  // Delete a member
  const handleDeleteMember = () => {
    if (memberToDelete) {
      deleteMember(memberToDelete.id);
      setIsDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  // Save member (add or update)
  const handleSaveMember = () => {
    if (currentMember) {
      if (currentMember.id) {
        // Update existing member
        updateMember(currentMember.id, currentMember);
      } else {
        // Add new member
        const { id, ...memberData } = currentMember;
        addMember(memberData);
      }
      
      setIsDialogOpen(false);
      setCurrentMember(null);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (currentMember) {
      setCurrentMember({ ...currentMember, [name]: value });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="family">
        <TabsList>
          <TabsTrigger value="family">Family Members</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="family">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Family Members</h2>
              <Button onClick={handleAddMember}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Member
              </Button>
            </div>
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Color</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div 
                          className="w-6 h-6 rounded-full mr-2" 
                          style={{ backgroundColor: member.color }}
                        ></div>
                        {member.color}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditMember(member)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeletePrompt(member)}>
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">System Settings</h2>
            <p className="text-gray-500">Additional settings will be added here.</p>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentMember && currentMember.id ? 'Edit Family Member' : 'Add Family Member'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details to {currentMember && currentMember.id ? 'update' : 'add'} a family member.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input 
                id="name"
                name="name"
                value={currentMember?.name || ''}
                onChange={handleInputChange} 
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              <select
                id="role"
                name="role"
                value={currentMember?.role || 'Child'}
                onChange={handleInputChange}
                className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="Child">Child</option>
                <option value="Parent">Parent</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">Color</Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input 
                  id="color"
                  name="color"
                  type="color"
                  value={currentMember?.color || '#9b87f5'}
                  onChange={handleInputChange}
                  className="w-12 h-10 p-1"
                />
                <Input 
                  value={currentMember?.color || '#9b87f5'}
                  onChange={handleInputChange}
                  name="color"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveMember}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Family Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {memberToDelete?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteMember}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
