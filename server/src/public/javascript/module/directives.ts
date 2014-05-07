declare var Silverlight: any;

var transitionOption = ' 1.25s';

// .player(.silverlight/.flash)
//   object(silverlight/flash)
export var silverlight = () => ({
    restrict: 'E',
    replace: true,
    template: '<div><div class="dummy" style="' + dummyStyle + '"></div></div>',
    link: (scope: any, element: JQuery, attrs: any) => {
        var chrome = window.navigator.userAgent.indexOf('Chrome') !== -1;

        var fullscreen = true;

        var dummy = element.children('.dummy');
        dummy.css('height', dummy.width() * 3 / 4);

        var sl = getSilverlight(
            chrome,
            attrs.localip,
            attrs.streamid,
            attrs.remoteip,
            () => element.click(),
            (width, height) => {
                dummy.css('height', dummy.width() * height / width);
                if (!fullscreen) {
                    sl.css('height', dummy.width() * height / width);
                }
            });
        element.append(sl);

        element.click(function (eventObject) {
            if (fullscreen) {
                sl.css(getWindowSilverlightStyle(dummy));
                fullscreen = false;
            } else {
                sl.css(fullscreenSilverlightStyle);
                fullscreen = true;
            }
        });
    }
});

function getSilverlight(chrome: boolean, localIp: string, streamId: string, remoteIp: string, onClick: Function, onMediaOpen: (width: number, height: number) => void) {
    return $(Silverlight.createObject(
        '/plugins/wmvplayer.xap',
        null,
        Date.now().toString(),// ��ӂȕ�����
        {
            width: '100%',
            height: '100%',
            background: '#000',
            version: '5.0',
            windowless: chrome ? 'true' : 'false'// chrome��true����Ȃ���iframe�Ƃ̏d�Ȃ肪��肭�`�悳��Ȃ�
        },
        {
            onError: () => console.error('Error on Silverlight'),
            onLoad: (sl: any, args: any) => {
                var ctrler = sl.Content.Controller;
                ctrler.addEventListener('click', onClick);
                ctrler.addEventListener('mediaOpened', () => onMediaOpen(ctrler.width, ctrler.height));
                ctrler.LocalIp = localIp;
                ctrler.Play(streamId, remoteIp);
            }
        },
        null, //�������p�����[�^
        null //onLoad �C�x���g�ɓn�����l
        ))
        .css(defaultSilverlightStyle);
}

var dummyStyle = 'width: 100%; background-color: #333;';
var defaultSilverlightStyle = {
    position: 'absolute',
    display: 'block',
    transition: 'top 0.125s, width 0.125s, height 0.125s',

    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 2000
};
// transition����overflow��ύX�����transition���~�܂�

function getWindowSilverlightStyle(dummy: JQuery) {
    return {
        top: dummy.position().top + 1, // 1px����Ă�
        width: '61.8%',
        height: dummy.height(),
        zIndex: ''// todo: 0.125s�K����x�点��
    };
}

var fullscreenSilverlightStyle = {
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 2000
};