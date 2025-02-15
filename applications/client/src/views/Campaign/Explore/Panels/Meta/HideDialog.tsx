import type { DialogProps } from '@blueprintjs/core';
import { Checkbox, Button, Classes, Dialog, Intent } from '@blueprintjs/core';
import { View16, ViewOff16 } from '@carbon/icons-react';
import { css } from '@emotion/react';
import { CarbonIcon } from '@redeye/client/components';
import type { InfoType } from '@redeye/client/types';
import { Txt } from '@redeye/ui-styles';
import { observer } from 'mobx-react-lite';
import type { ChangeEvent } from 'react';
import { useState, useCallback } from 'react';

type Props = DialogProps & {
	typeName: string;
	infoType: InfoType;
	onHide?: () => void;
	isHiddenToggled?: boolean;
	last?: boolean;
};

export const ToggleHiddenDialog = observer<Props>(
	({ typeName, infoType, onClose, isHiddenToggled = true, onHide = () => undefined, last, ...props }) => {
		const [loading, setLoading] = useState(false);
		const [checked, setChecked] = useState(window.localStorage.getItem('disableDialog') === 'true');
		const plural = isHiddenToggled ? 'Showing' : 'Hiding';
		const verb = isHiddenToggled ? 'Show' : 'Hide';

		const handleCheck = useCallback((e: ChangeEvent<HTMLInputElement>) => {
			setChecked(e.target.checked);
			window.localStorage.setItem('disableDialog', e.target.checked.toString());
		}, []);

		return (
			<Dialog
				onClose={onClose}
				title={
					last && !isHiddenToggled
						? `Cannot hide final ${infoType.toLowerCase()}`
						: `${verb} this ${infoType.toLowerCase()}?`
				}
				{...props}
			>
				<div cy-test="show-hide-dialog-text" className={Classes.DIALOG_BODY}>
					{last && !isHiddenToggled ? (
						<>
							<Txt tagName="p">
								{plural} this {infoType.toLowerCase()} will create a state in which the UI has no content. To hide this{' '}
								{infoType}, you must unhide another {infoType.toLowerCase()}.
							</Txt>
							<Txt tagName="p">
								To unhide {infoType.toLowerCase()}s, toggle
								<Txt bold> &quot;Show Hidden Beacons, Hosts, and Servers&quot;</Txt> in the Application Settings, and go select
								<Txt bold> &quot;Show {infoType}&quot;</Txt> on one of the hidden {infoType.toLowerCase()}s.
							</Txt>
						</>
					) : (
						<>
							<Txt cy-test="dialog-text-line1" tagName="p">
								{plural} this {infoType.toLowerCase()} will make it {isHiddenToggled ? 'appear' : 'disappear from display'} in
								the UI.
							</Txt>
							{!isHiddenToggled && (
								<Txt cy-test="dialog-text-line2" tagName="p">
									{plural} this {infoType.toLowerCase()} will NOT delete it. Hidden {infoType.toLowerCase()}s can be shown again
									by toggling the
									<Txt bold> &quot;Show Hidden Beacons, Hosts, and Servers&quot;</Txt> in the Application Settings.
								</Txt>
							)}
							<Txt cy-test="dialog-text-line3" tagName="p">
								This will also {verb.toLowerCase()} descendants that are linked to this {infoType.toLowerCase()}.
							</Txt>
							<Checkbox label="Don’t show this warning again" checked={checked} onChange={handleCheck} />
						</>
					)}
				</div>
				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button cy-test="cancel-show-hide" onClick={onClose}>
							Cancel
						</Button>
						<Button
							cy-test="confirm-show-hide"
							intent={Intent.PRIMARY}
							rightIcon={!last && isHiddenToggled && <CarbonIcon icon={isHiddenToggled ? View16 : ViewOff16} />}
							loading={loading}
							onClick={
								last && !isHiddenToggled
									? onClose
									: (e) => {
											e.stopPropagation();
											setLoading(true);
											onHide();
									  }
							}
							css={buttonStyle}
						>
							{last && !isHiddenToggled ? 'OK' : `${verb} ${infoType}`}
						</Button>
					</div>
				</div>
			</Dialog>
		);
	}
);

const buttonStyle = css`
	min-width: 62.58px;
`;
