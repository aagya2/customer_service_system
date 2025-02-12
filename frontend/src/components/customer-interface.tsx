'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';

export default function CustomerInterface() {
  const handleSubmit = async (formData: FormData) => {
    // Here you would typically send the ticket data to your backend
    const customerName = formData.get('customerName');
    const description = formData.get('description');
    const category = formData.get('category');
    const data = {
      customerName,
      description,
      category,
    };

    try {
      const response = axios.post('http://localhost:3000/api/tickets', data);
      console.log(response);
      toast({
        title: 'Ticket Submitted',
        description: 'Your ticket has been successfully created.',
      });
      // Reset form
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.log('Error creating ticket:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Ticket</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Customer Name</Label>
            <Input id="name" name="customerName" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select name="category">
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Support</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="general">General Inquiry</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full cursor-pointer">
            Submit Ticket
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
