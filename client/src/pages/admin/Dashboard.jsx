import { Tab } from '@headlessui/react';
import { useState } from 'react';
import Analytics from '../../components/admin/Analytics';
import PrizeManagement from '../../components/admin/PrizeManagement';
import SecretCodeManagement from '../../components/admin/SecretCodeManagement';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { name: 'Giải Thưởng', component: <PrizeManagement /> },
    { name: 'Mã Bí Mật', component: <SecretCodeManagement /> },
    { name: 'Thống Kê', component: <Analytics /> },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Quản Lý Hệ Thống</h1>

      <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
        <Tab.List className="flex space-x-1 rounded-xl bg-indigo-100 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white text-indigo-700 shadow'
                    : 'text-indigo-600 hover:bg-white/[0.12] hover:text-indigo-800',
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-6">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white p-6',
                'ring-white ring-opacity-60 ring-offset-2 focus:outline-none focus:ring-2',
              )}
            >
              {tab.component}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}

export default AdminDashboard;
