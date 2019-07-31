    $(document).ready(function() {
        $('#tablepage').bootstrapTable({
            columns: [
            {
                field: '申请人',
                title: '申请人',
                align: 'center'
            }, {
                field: '申请时间',
                title: '申请时间',
                align: 'center'
            }, {
                field: '设备配置',
                title: '设备配置',
                align: 'center'
            }, {
                field: '人员配置',
                title: '人员配置',
                align: 'center'
            }, {
                field: '能力分析',
                title: '能力分析',
                align: 'center'
            }, {
                field: '申请方式',
                title: '申请方式',
                align: 'center'
            }, {
                field: '实验室主任',
                title: '实验室主任',
                align: 'center'
            }, {
                field: '主任意见',
                title: '主任意见',
                align: 'center'
            }, {
                field: '不同意原因',
                title: '不同意原因',
                align: 'center'
            }, {
                field: '扩项申请结果',
                title: '扩项申请结果',
                align: 'center'
            }, {
                field: '认可委网站结果',
                title: '认可委网站结果',
                align: 'center'
            }]
        });
    });