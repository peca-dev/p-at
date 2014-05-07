﻿import channelsfactory = require('./channelsfactory');
import Channel = require('./channel');

var osirase = 'TPからのお知らせ◆お知らせ';

export function url(localPort: number) {
    return 'http://temp.orz.hm/yp/index.txt?port=' + localPort;
}

export function getChannels(body: string) {
    var list = channelsfactory.fromIndexTxt(body, 'TP')
    // Free, Open, Over, 3Mbps Overを取り出す。descからは削除
        .select(channel => {
            var r = channel.desc.match(/(?: - )?&lt;(.*)&gt;$/);
            if (r == null) {
                channel.bandType = '';
                return channel;
            }
            channel.bandType = r[1];
            channel.desc = channel.desc.substring(0, (<any>r).index);
            return channel;
        });

    return [
        list.where(x => x.name !== osirase).toArray(),
        list.where(x => x.name === osirase).toArray()
    ];
}