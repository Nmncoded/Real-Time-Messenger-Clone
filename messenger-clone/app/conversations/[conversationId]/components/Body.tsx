"use client";
import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import React, { useMemo } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";

interface BodyProps {
  conversation: Conversation & {
    users: User[];
  };
}

const Body: React.FC<BodyProps> = ({ conversation }) => {
  return <div>Body!!!!</div>;
};

export default Body;
