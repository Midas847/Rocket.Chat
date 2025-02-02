import { useSetting, useTranslation, useRoute } from '@rocket.chat/ui-contexts';
import React, { useCallback } from 'react';

import UpsellModal from '../../components/UpsellModal';

export type UnlimitedAppsUpsellModalProps = {
	onClose: () => void;
};

const UnlimitedAppsUpsellModal = ({ onClose }: UnlimitedAppsUpsellModalProps) => {
	const t = useTranslation();
	const cloudWorkspaceHadTrial = useSetting('Cloud_Workspace_Had_Trial') as boolean;
	const urls = {
		goFullyFeaturedRegistered: '/upgrade/go-fully-featured-registered',
		talkToSales: 'https://go.rocket.chat/i/contact-sales',
	};

	const adminRoute = useRoute('admin-index');

	const goFullyFeaturedRegistered = useCallback(() => {
		adminRoute.push({ context: urls.goFullyFeaturedRegistered });
		onClose();
	}, [adminRoute, onClose, urls.goFullyFeaturedRegistered]);

	const goToTalkSales = useCallback(() => {
		window.open(urls.talkToSales, '_blank');
		onClose();
	}, [onClose, urls.talkToSales]);

	return (
		<UpsellModal
			title={t('Enable_unlimited_apps')}
			img='images/unlimited-apps-modal.svg'
			subtitle={t('Get_all_apps')}
			description={!cloudWorkspaceHadTrial ? t('Workspaces_on_community_edition_trial_on') : t('Workspaces_on_community_edition_trial_off')}
			confirmText={!cloudWorkspaceHadTrial ? t('Start_free_trial') : t('Learn_more')}
			cancelText={t('Talk_to_sales')}
			onConfirm={goFullyFeaturedRegistered}
			onCancel={goToTalkSales}
			onClose={onClose}
		/>
	);
};

export default UnlimitedAppsUpsellModal;
