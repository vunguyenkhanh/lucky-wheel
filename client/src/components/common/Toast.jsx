import { Transition } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Fragment } from 'react';

function Toast({ message, type = 'success', onClose }) {
  return (
    <Transition
      show={true}
      as={Fragment}
      enter="toast-enter"
      enterFrom="toast-enter"
      enterTo="toast-enter-active"
      leave="toast-exit"
      leaveFrom="toast-exit"
      leaveTo="toast-exit-active"
    >
      <div className="fixed bottom-4 right-4 flex items-center gap-2 p-4 rounded-md shadow-lg bg-white">
        {type === 'success' ? (
          <CheckCircleIcon className="h-6 w-6 text-green-500" />
        ) : (
          <XCircleIcon className="h-6 w-6 text-red-500" />
        )}
        <p className={type === 'success' ? 'text-green-800' : 'text-red-800'}>{message}</p>
      </div>
    </Transition>
  );
}

export default Toast;
