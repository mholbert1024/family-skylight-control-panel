
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Check, ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ShoppingItem {
  id: number;
  name: string;
  category: string;
  purchased: boolean;
  addedBy: string;
}

// Mock shopping list data
const mockShoppingItems: ShoppingItem[] = [
  { id: 1, name: 'Milk', category: 'Groceries', purchased: false, addedBy: 'Mom' },
  { id: 2, name: 'Bread', category: 'Groceries', purchased: false, addedBy: 'Dad' },
  { id: 3, name: 'Apples', category: 'Groceries', purchased: true, addedBy: 'Lisa' },
  { id: 4, name: 'Notebook', category: 'School Supplies', purchased: false, addedBy: 'Jimmy' },
  { id: 5, name: 'Shampoo', category: 'Household', purchased: false, addedBy: 'Mom' },
  { id: 6, name: 'Soccer ball', category: 'Sports', purchased: true, addedBy: 'Jimmy' },
];

const ShoppingListView: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>(mockShoppingItems);
  const [newItem, setNewItem] = useState<Omit<ShoppingItem, 'id' | 'purchased'>>({
    name: '',
    category: 'Groceries',
    addedBy: 'Mom'
  });
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'purchased'>('active');
  
  const handleAddItem = () => {
    const item: ShoppingItem = {
      id: items.length + 1,
      name: newItem.name,
      category: newItem.category,
      purchased: false,
      addedBy: newItem.addedBy
    };
    
    setItems([...items, item]);
    setIsAddItemOpen(false);
    setNewItem({
      name: '',
      category: 'Groceries',
      addedBy: 'Mom'
    });
  };
  
  const toggleItemPurchased = (itemId: number) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, purchased: !item.purchased } : item
    ));
  };
  
  // Filter items
  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'active') return !item.purchased;
    if (filter === 'purchased') return item.purchased;
    return true;
  });

  // Group items by category
  const groupedItems: Record<string, ShoppingItem[]> = {};
  filteredItems.forEach(item => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Shopping List</h2>
        
        <div className="flex gap-2">
          <Select 
            value={filter}
            onValueChange={(value: 'all' | 'active' | 'purchased') => setFilter(value)}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="active">To Buy</SelectItem>
              <SelectItem value="purchased">Purchased</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Shopping Item</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Item Name</Label>
                  <Input 
                    id="name" 
                    value={newItem.name} 
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    placeholder="Enter item name" 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newItem.category}
                    onValueChange={(value) => setNewItem({...newItem, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Groceries">Groceries</SelectItem>
                      <SelectItem value="Household">Household</SelectItem>
                      <SelectItem value="School Supplies">School Supplies</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="addedBy">Added By</Label>
                  <Select 
                    value={newItem.addedBy}
                    onValueChange={(value) => setNewItem({...newItem, addedBy: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select person" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mom">Mom</SelectItem>
                      <SelectItem value="Dad">Dad</SelectItem>
                      <SelectItem value="Jimmy">Jimmy</SelectItem>
                      <SelectItem value="Lisa">Lisa</SelectItem>
                      <SelectItem value="Emma">Emma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddItem} disabled={newItem.name === ''}>
                  Add to List
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-10">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-xl text-muted-foreground">No items in the list</p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="font-semibold mb-2 pb-1 border-b">{category}</h3>
              <div className="space-y-2">
                {items.map(item => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      item.purchased ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    onClick={() => toggleItemPurchased(item.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center ${
                        item.purchased ? 'bg-green-100 border-green-500' : 'border-gray-300'
                      }`}>
                        {item.purchased && <Check className="h-4 w-4 text-green-600" />}
                      </div>
                      <span className={item.purchased ? 'line-through' : ''}>
                        {item.name}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Added by: {item.addedBy}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ShoppingListView;
