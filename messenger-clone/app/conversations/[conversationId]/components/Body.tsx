"use client";
import Avatar from "@/app/components/Avatar";
import useConversation from "@/app/hooks/useConversation";
import useOtherUser from "@/app/hooks/useOtherUser";
import { FullMessageType } from "@/app/types";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from "react-icons/hi2";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[]
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);
  const {conversationId} = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  },[conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView({
      behavior: 'smooth',
    });

    const messageHandler = (message: FullMessageType) => {

      // console.log("message-------",message)
      axios.post(`/api/conversations/${conversationId}/seen`);
      setMessages(current => {
        if(find(current, {id: message.id})) {
          return current;
        }
        return [...current, message];
      })
      bottomRef?.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages(current => current?.map(currentMessage => {
        if(currentMessage.id === newMessage.id) {
          return newMessage;
        }
        return currentMessage;
        
      }))
    }

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('message:update', updateMessageHandler);

    }

  },[conversationId])


  return <div className="flex-1 overflow-y-auto" >
    {
      messages.map((message,i) => (
        <MessageBox isLast={i === (messages.length - 1)} key={message.id} data={message} />
      ))
    }
    <div ref={bottomRef} className="pt-24" />
  </div>;
};

export default Body;
