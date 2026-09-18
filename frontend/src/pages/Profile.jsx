import { useState, useEffect } from 'react';
import { User, Mail, Briefcase, Trash2, Edit2, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import { STATES, OCCUPATIONS, EDUCATION_LEVELS, CATEGORIES } from '../utils/constants';
import { generateInitials } from '../utils/helpers';
import * as userService from '../services/userService';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import toast from 'react-hot-toast';

const buildFormData = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  state: user?.state || user?.profile?.state || '',
  occupation: user?.profile?.occupation || '',
  income: user?.profile?.income ?? '',
  education: user?.profile?.education || '',
  category: user?.profile?.category || '',
  age: user?.profile?.age ?? '',
  isFarmer: !!user?.profile?.isFarmer,
  isStudent: !!user?.profile?.isStudent,
  isRural: !!user?.profile?.isRural,
});

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState(buildFormData(user));

  useEffect(() => {
    setFormData(buildFormData(user));
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await userService.updateProfile({
        name: formData.name,
        state: formData.state,
        profile: {
          age: formData.age,
          state: formData.state,
          occupation: formData.occupation,
          income: formData.income,
          education: formData.education,
          category: formData.category,
          isFarmer: formData.isFarmer,
          isStudent: formData.isStudent,
          isRural: formData.isRural,
        },
      });
      updateUser({ ...user, ...response.data.data });
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(buildFormData(user));
    setIsEditing(false);
  };

  const confirmDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await userService.deleteAccount();
      logout();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete account.');
      setIsDeleting(false);
    }
  };

  const stateOptions = [{ value: '', label: 'Select State' }, ...STATES.map((s) => ({ value: s, label: s }))];
  const occupationOptions = [{ value: '', label: 'Select Occupation' }, ...OCCUPATIONS.map((o) => ({ value: o, label: o }))];
  const educationOptions = [{ value: '', label: 'Select Education' }, ...EDUCATION_LEVELS.map((e) => ({ value: e, label: e }))];
  const categoryOptions = [{ value: '', label: 'Select Category' }, ...CATEGORIES.map((c) => ({ value: c, label: c }))];

  return (
    <div className="space-y-8">
      <div className="pb-6 border-b border-border">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary font-sans">
          {t('myProfile') || 'Citizen Profile & Preferences'}
        </h1>
        <p className="text-sm text-muted mt-1">
          Manage your verified demographic data, language preferences, and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card variant="glass-strong" radius="2xl" className="text-center" style={{ background: 'rgba(14, 18, 32, 0.94)', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
            <div className="w-24 h-24 rounded-full bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400 text-3xl font-bold mx-auto mb-4">
              {generateInitials(user?.name)}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {user?.name || 'User'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{user?.email}</p>
            <Badge variant="info">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</Badge>
          </Card>

          <Card variant="glass-strong" radius="2xl" className="mt-6" style={{ background: 'rgba(14, 18, 32, 0.94)', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
            <Button
              variant="danger"
              fullWidth
              iconLeft={<Trash2 className="w-4 h-4" />}
              onClick={() => setShowDeleteModal(true)}
            >
              {t('deleteAccount')}
            </Button>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card variant="glass-strong" radius="2xl" style={{ background: 'rgba(14, 18, 32, 0.94)', border: '1px solid rgba(255, 255, 255, 0.25)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t('personalInfo')}
              </h2>
              {!isEditing ? (
                <Button
                  size="sm"
                  variant="secondary"
                  iconLeft={<Edit2 className="w-4 h-4" />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    iconLeft={<X className="w-4 h-4" />}
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    loading={isSaving}
                    iconLeft={<Save className="w-4 h-4" />}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Input
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!isEditing}
                iconLeft={<User className="w-5 h-5 text-gray-400" />}
              />

              <Input
                label="Email"
                type="email"
                value={formData.email}
                disabled
                helperText="Email cannot be changed"
                iconLeft={<Mail className="w-5 h-5 text-gray-400" />}
              />

              <Input
                label="Age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                disabled={!isEditing}
              />

              <Select
                label="State"
                options={stateOptions}
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                disabled={!isEditing}
              />

              <Select
                label="Occupation"
                options={occupationOptions}
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                disabled={!isEditing}
              />

              <Input
                label="Annual Income (₹)"
                type="number"
                placeholder="e.g., 250000"
                value={formData.income}
                onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                disabled={!isEditing}
                iconLeft={<Briefcase className="w-5 h-5 text-gray-400" />}
              />

              <Select
                label="Education"
                options={educationOptions}
                value={formData.education}
                onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                disabled={!isEditing}
              />

              <Select
                label="Category"
                options={categoryOptions}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                disabled={!isEditing}
              />

              {isEditing && (
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isFarmer}
                      onChange={(e) => setFormData({ ...formData, isFarmer: e.target.checked })}
                      className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Farmer</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isStudent}
                      onChange={(e) => setFormData({ ...formData, isStudent: e.target.checked })}
                      className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Student</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isRural}
                      onChange={(e) => setFormData({ ...formData, isRural: e.target.checked })}
                      className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Rural Resident</span>
                  </label>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {t('confirmDelete')}
          </p>
          <p className="text-sm text-danger">
            This action cannot be undone. All your data will be permanently deleted.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" loading={isDeleting} onClick={confirmDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
