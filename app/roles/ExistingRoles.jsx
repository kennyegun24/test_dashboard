"use client";
import { fetchRoles, selectRole } from "@/store/roles";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import RoleContext from "./_components/ContextMenu";

const ExistingRoles = () => {
  const { roles, selectedRole } = useSelector((state) => state.roles);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchRoles());
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h4 className="text-[.8rem] font-[400] text-[--primary-text-color]">
        Existing Roles
      </h4>

      <section className="text-[.7rem] flex flex-col gap-1 font-[400] text-[--primary-text-color]">
        {roles?.map((e, _) => (
          <RoleContext
            data={e}
            dispatch={dispatch}
            selectedRole={selectedRole}
            selectRole={selectRole}
          />
        ))}
      </section>
    </div>
  );
};

export default ExistingRoles;
