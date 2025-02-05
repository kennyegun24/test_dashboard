"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_API_ROUTE } from "@/utils/api_route";
import { fetchRoles } from "@/store/roles";
import { sendToast } from "@/lib/helper";

const FormSchema = z.object({
  VIEW_TEAMS: z.boolean().default(false).optional(),
  MANAGE_TEAMS: z.boolean().default(false).optional(),
  EDIT_PERMISSIONS: z.boolean(),
  // EDIT_PERMISSIONS: z.boolean().refine((val) => val === true, {
  //   message: "You must grant edit permissions",
  // }),
  CREATE_PERMISSIONS: z.boolean().default(false).optional(),
  EDIT_PRIVACY_POLICY: z.boolean().default(false).optional(),
  EDIT_TERMS_CONDITIONS: z.boolean().default(false).optional(),
  WRITE_BLOG: z.boolean().default(false).optional(),
  SERVICES: z.boolean().default(false).optional(),
  REVIEWS: z.boolean().default(false).optional(),
  COMPANY_CONTENT: z.boolean().default(false).optional(),
  SOCIAL_MEDIA: z.boolean().default(false).optional(),
  VIEW_CALENDAR: z.boolean().default(false).optional(),
  CREATE_TASK: z.boolean().default(false).optional(),
  SALES: z.boolean().default(false).optional(),
  ADD_NEW_SALES_RECORDS: z.boolean().default(false).optional(),
});

const SwitchForm = () => {
  const { selectedRole } = useSelector((state) => state.roles);
  const dispatch = useDispatch();
  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: selectedRole
      ? Object.fromEntries(
          Object.keys(FormSchema.shape).map((key) => [
            key,
            selectedRole.permissions?.includes(key),
          ])
        )
      : {},
  });

  useEffect(() => {
    if (selectedRole) {
      form.reset(
        Object.fromEntries(
          Object.keys(FormSchema.shape).map((key) => [
            key,
            selectedRole.permissions?.includes(key),
          ])
        )
      );
    }
  }, [selectedRole, form]);

  const onSubmit = async (data) => {
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
    try {
      const req = await axios.put(`${BACKEND_API_ROUTE}/roles`, {
        _id: selectedRole?._id,
        permissions: data,
      });
      dispatch(fetchRoles());
      sendToast({
        title: "Role Edited",
      });
    } catch (error) {
      return sendToast({
        variant: "destructive",
        title: error.response.data.error || "Something went wrong",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div>
          <h3 className="mb-4 text-lg font-medium text-[--primary-text-color]">
            Team Permissions
          </h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="VIEW_TEAMS"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      View Team Members
                    </FormLabel>
                    <FormDescription>
                      Allow people with role to view all team members
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="MANAGE_TEAMS"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      Manage Team
                    </FormLabel>
                    <FormDescription>
                      Allow team members with role to be able to manage team
                      members (add new team members, remove team members, assign
                      roles to team members)
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium text-[--primary-text-color]">
            Permissions privilege
          </h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="EDIT_PERMISSIONS"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      Edit Permissions
                    </FormLabel>
                    <FormDescription>
                      Allow team members with this role to edit permissions.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="edit_permissions"
              render={({ field }) => (
                <FormItem
                  className={cn(
                    "flex flex-row relative items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm",
                    form.formState.errors.edit_permissions && "border-red-500"
                  )}
                >
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      Edit Permissions
                    </FormLabel>
                    <FormDescription>
                      Allow team members with this role to edit permissions.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="CREATE_PERMISSIONS"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      Create Permissions
                    </FormLabel>
                    <FormDescription>
                      Allow team members with this role to create new
                      permissions.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium text-[--primary-text-color]">
            Legal Pages
          </h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="EDIT_PRIVACY_POLICY"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      Edit and create privacy policy
                    </FormLabel>
                    <FormDescription>
                      Allow team members with this role to have the privilege to
                      create and edit privacy policy
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="EDIT_TERMS_CONDITIONS"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      Edit Terms of Conditions
                    </FormLabel>
                    <FormDescription>
                      Allow team members with this role to have the privilege to
                      create and edit terms of service
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium text-[--primary-text-color]">
            Content Permissions
          </h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="WRITE_BLOG"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      Write Blogs
                    </FormLabel>
                    <FormDescription>
                      Allow people with role to view all team members to create
                      new blog posts
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="SERVICES"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      Services
                    </FormLabel>
                    <FormDescription>
                      Allow team members with this role to add new, delete and
                      edit services
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="REVIEWS"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      Reviews
                    </FormLabel>
                    <FormDescription>
                      Allow team members with this role to add new, delete and
                      edit customer reviews
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="COMPANY_CONTENT"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      Company Content
                    </FormLabel>
                    <FormDescription>
                      Allow team members with this role to add new, delete and
                      edit company contents such as logo, name etc
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium text-[--primary-text-color]">
            Social Media
          </h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="SOCIAL_MEDIA"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      Social Media Comments
                    </FormLabel>
                    <FormDescription>
                      Allow team members with this role to be able to respond to
                      customers comments on SM
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium text-[--primary-text-color]">
            Leads
          </h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="VIEW_CALENDAR"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      View Calendar
                    </FormLabel>
                    <FormDescription>
                      Allow team members with this role to be able to view
                      clients appointments
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="CREATE_TASK"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      Create Task
                    </FormLabel>
                    <FormDescription>
                      Allow team members with this role to be able to create
                      tasks
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-medium text-[--primary-text-color]">
            Sales
          </h3>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="SALES"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      View Sales Page
                    </FormLabel>
                    <FormDescription>
                      Allow team members with this role to be able to view sales
                      page contents
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ADD_NEW_SALES_RECORDS"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[--secondary-border-color] p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel className="text-[--primary-text-color]">
                      Add new sales records
                    </FormLabel>
                    <FormDescription>
                      Allow team members with this role to have the privilege to
                      create sales records
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

const Permissions = () => {
  return (
    <div className="w-[50%]">
      <SwitchForm />
    </div>
  );
};

export default Permissions;
