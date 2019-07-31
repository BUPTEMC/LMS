    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '项目名称',
                title: '项目名称',
                align: 'center'
            }, {
                field: '立项标准',
                title: '立项标准',
                align: 'center'
            }, {
                field: '评审人员',
                title: '评审人员',
                align: 'center'
            }, {
                field: '市场前景及经济效益',
                title: '市场前景...',
                titleTooltip:'市场前景及经济效益',
                align: 'center'
            }, {
                field: '环境',
                title: '环境',
                align: 'center'
            }, {
                field: '设备',
                title: '设备',
                align: 'center'
            }, {
                field: '人员配置',
                title: '人员配置',
                align: 'center'
            }, {
                field: '开展新项目的测试方法',
                title: '测试方法...',
                titleTooltip:'开展新项目的测试方法',
                align: 'center'
            }, {
                field: '总分',
                title: '总分',
                align: 'center'
            }, {
                field: '评审结果',
                title: '评审结果',
                align: 'center'
            }]
        });
    });