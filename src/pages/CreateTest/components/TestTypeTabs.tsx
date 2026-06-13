import { useParams } from 'react-router-dom';
import AppTabs from '@/common/components/AppTabs';
import {
  CREATE_TEST_TYPE_URL,
  EDIT_TEST_TYPE_URL,
} from '@/constants/routes';
import { TEST_TYPES } from '@/pages/CreateTest/constants';

export default function TestTypeTabs() {
  const { id } = useParams();

  const tabList = TEST_TYPES.map((type) => ({
    label: type.label,
    link: id
      ? EDIT_TEST_TYPE_URL(id, type.value)
      : CREATE_TEST_TYPE_URL(type.value),
  }));

  return <AppTabs variant="pill" tabList={tabList} />;
}
