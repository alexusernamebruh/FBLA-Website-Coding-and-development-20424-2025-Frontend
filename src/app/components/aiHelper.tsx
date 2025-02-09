import {
  ChatBubbleLeftEllipsisIcon,
  EllipsisHorizontalCircleIcon,
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useEffect, useState, useRef } from 'react';
import { a } from '../config';
import { IChat, IChatContent } from '../interfaces';
import ReactMarkdown from 'react-markdown';
import Modal from './modal';

export default function AIHelper({ userType }: { userType: string }) {
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [selected, setSelected] = useState('New Chat');
  const [input, setInput] = useState('');
  const [chat, setChat] = useState<IChat>({
    id: 0,
    title: '',
    content: [],
    userType: userType,
  });
  const [responseLoading, setResponseLoading] = useState(false);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const [createdChats, setCreatedChats] = useState([]);
  const [showDeleteChatWarning, setShowDeleteChatWarning] = useState(false);

  const getChats = async () => {
    const { data: result } = await a.get(
      `/ai?userId=${
        JSON.parse(localStorage.getItem('Applicant')!).applicantId
      }&userType=APPLICANT`,
    );
    console.log(result);
    setCreatedChats(result);
  };

  const createChat = async () => {
    setResponseLoading(true);
    const userInput = input;
    setInput('');

    const { data: result } = await a.post('/ai/createChat', {
      userId: JSON.parse(localStorage.getItem('Applicant')!).applicantId,
      userType: 'APPLICANT',
      userMessage: userInput,
    });

    console.log(result);

    const createdChat = result;

    if (userInput.startsWith('Recommend me a job')) {
      getChats();

      const { data: result } = await a.post(`/ai/recommendJob`, {
        chatId: createdChat.id,
        userRequest: userInput,
        applicantId: JSON.parse(localStorage.getItem('Applicant')!).applicantId,
      });

      getChat(createdChat.id);

      console.log(result);
      setSelected('Chat');
    } else {
      setSelected('Chat');
      await a.post('/ai/', {
        chatId: result.id,
        userMessage: userInput,
      });
      getChat(result.id);
      getChats();
    }
    setResponseLoading(false);
  };

  const getChat = async (chatId: number) => {
    const { data: result } = await a.get(`/ai/${chatId}`);
    setChat({ ...result, content: JSON.parse(result.content) });
  };

  const sendMessage = async () => {
    setChat({
      ...chat,
      content: [...chat.content, { role: 'user', content: input }],
    });
    const userInput = input;
    setInput('');

    setResponseLoading(true);
    if (input.startsWith('Recommend me a job')) {
      const { data: result } = await a.post(`/ai/recommendJob`, {
        chatId: chat.id,
        userRequest: userInput,
        applicantId: JSON.parse(localStorage.getItem('Applicant')!).applicantId,
      });

      setResponseLoading(false);

      setChat({
        ...chat,
        content: [
          ...chat.content,
          { role: 'user', content: userInput },
          { role: 'ai', content: result },
        ],
      });

      console.log(result);
    } else {
      const { data: result } = await a.post(`/ai/`, {
        chatId: chat.id,
        userMessage: userInput,
      });

      setResponseLoading(false);

      setChat({
        ...chat,
        content: [
          ...chat.content,
          { role: 'user', content: userInput },
          { role: 'ai', content: result },
        ],
      });

      console.log(result);
    }
  };

  const deleteChat = async () => {
    setShowDeleteChatWarning(false);
    const { data: response } = await a.delete(`/ai/${chat.id}`);
    setSelected('New Chat');
    getChats();
  };

  useEffect(() => {
    getChats();
  }, []);

  return (
    <div className='bg-grid bg-white h-screen w-full overflow-auto p-6'>
      {/* Warnings */}
      <div className=''>
        <Modal open={showDeleteChatWarning} setOpen={setShowDeleteChatWarning}>
          <div className='flex flex-col space-y-2'>
            <div className='mx-auto w-12 h-12 p-2 text-red-500 font-bold bg-red-50 rounded-full'>
              <ExclamationTriangleIcon />
            </div>
            <div className='px-4'>
              Are you sure you want to delete{' '}
              <span className='font-semibold'>{chat.title}</span>? This action
              cannot be undone.
            </div>
            <div
              onClick={() => deleteChat()}
              className='w-full bg-red-500 hover:bg-red-600 hover:cursor-pointer rounded-md py-2 text-center font-semibold text-white text-md'
            >
              Delete {chat.title}
            </div>
          </div>
        </Modal>
      </div>
      {/* Warnings end */}

      <div className='border border-gray-300 shadow rounded-md bg-white w-full h-full flex'>
        {/* sidebar */}
        <div className='max-w-[20rem] flex items-center flex-col w-fit h-full space-y-1 border-r border-gray-300'>
          <div className='px-4 py-4 border-b border-gray-300 w-full'>
            <div
              className='px-4 py-2 text-sm font-semibold w-full text-center mb-1 rounded-md border border-gray-300 hover:cursor-pointer hover:bg-gray-100'
              onClick={() => setSelected('New Chat')}
            >
              New Chat
            </div>
          </div>
          <div className='px-4 py-4 flex overflow-auto scrollbar-hide flex-col'>
            <p className='text-sm text-center mb-1 font-semibold'>
              Created Chats
            </p>
            {createdChats.map((chat: { id: number; title: string }) => (
              <div
                key={chat.id}
                className='text-sm group overflow-x-clip max-w-[15rem] whitespace-nowrap inline-flex font-semibold text-gray-700 px-4 items-center py-1.5 w-full  hover:bg-gray-100 hover:cursor-pointer rounded-md'
                onClick={() => {
                  setSelected('Chat');
                  getChat(chat.id);
                }}
              >
                <div className='mr-1 max-w-[11.5rem] overflow-x-clip '>
                  {chat.title}
                </div>
                <div
                  onClick={() => setShowDeleteChatWarning(true)}
                  className='ml-auto group-hover:opacity-100 opacity-0 w-4 h-4 text-red-500'
                >
                  <TrashIcon />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* sidebar ends */}

        {/* New Chat */}
        {selected === 'New Chat' && (
          <div className='px-6 py-6 w-full justify-center h-full flex flex-col'>
            <div className='mt-auto'>
              <p className='text-2xl text-center text-blue-500 font-semibold'>
                Ask for help/job suggestions or anything else!
              </p>
            </div>
            <div className='mt-auto border border-gray-300 rounded-md'>
              <div className='grid w-full grid-cols-1'>
                <input
                  type='text'
                  onChange={(v) => setInput(v.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && input !== '') {
                      createChat();
                    }
                  }}
                  placeholder='Recommend me a job based on...'
                  className='col-start-1 row-start-1 rounded-md block focus:outline-none w-full bg-white py-4 pl-10 pr-3 text-base text-gray-900 placeholder:text-gray-400'
                />
                <ChatBubbleLeftEllipsisIcon
                  aria-hidden='true'
                  className='pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400'
                />
              </div>
            </div>
          </div>
        )}
        {/* New Chat ends*/}

        {/* Chat */}
        {selected === 'Chat' && (
          <div className='px-6 py-6 w-full justify-center h-full flex flex-col'>
            <div className='mt-6 overflow-auto scrollbar-hide h-full space-y-16 py-8 w-full'>
              {chat.content.map((content: IChatContent, i: number) => (
                <div key={i} className='w-full'>
                  <div
                    className={`text-md whitespace-pre-line font-medium max-w-[75%] py-2 px-3 w-fit rounded-md ${
                      content.role === 'ai'
                        ? 'mr-auto bg-gray-100'
                        : 'ml-auto bg-blue-100'
                    }`}
                  >
                    <ReactMarkdown>{content.content.toString()}</ReactMarkdown>
                  </div>
                </div>
              ))}

              {responseLoading && (
                <div className='py-4 px-3 bg-gray-100 w-fit space-x-1 rounded-md flex'>
                  <div className='rounded-full w-3 h-3 animate-pulse bg-gray-400' />
                  <div className='rounded-full w-3 h-3 animate-pulse bg-gray-400' />
                  <div className='rounded-full w-3 h-3 animate-pulse bg-gray-400' />
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
            <div className='mt-auto border border-gray-300 rounded-md'>
              <div className='grid w-full grid-cols-1'>
                <input
                  type='text'
                  onChange={(v) => setInput(v.target.value)}
                  value={input}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !responseLoading) {
                      sendMessage();
                    }
                  }}
                  placeholder='Ask anything'
                  className='col-start-1 row-start-1 rounded-md block focus:outline-none w-full bg-white py-4 pl-10 pr-3 text-base text-gray-900 placeholder:text-gray-400'
                />
                <ChatBubbleLeftEllipsisIcon
                  aria-hidden='true'
                  className='pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400'
                />
              </div>
            </div>
          </div>
        )}
        {/* Chat ends */}
      </div>
    </div>
  );
}
