import { configure, setAddon } from '@storybook/react';
import infoAddon, { setDefaults } from '@storybook/addon-info';

import '../styles/main.scss';

setDefaults({
    inline: true,
    maxPropsIntoLine: 5,
    styles: stylesheet => {
        stylesheet.infoBody = {
            color: '#575c5f'
        };

        stylesheet.header = {
            h1: {
                color: '#007ebe',
                margin: '1rem 0 0 0'
            },
            h2: {
                padding: '.5rem 0',
                marginTop: 0,
                fontWeight: 300,
                borderBottom: '1px solid #eee'
            }
        };

        stylesheet.propTableHead = {
            display: 'none'
        };

        return stylesheet;
    }
});

setAddon(infoAddon);

function loadStories() {
    require('../stories/index.js');
}

configure(loadStories, module);