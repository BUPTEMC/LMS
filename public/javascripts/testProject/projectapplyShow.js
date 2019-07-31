    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '项目名称',
                title: '项目名称',
                align: 'center'
            }, {
                field: '申请人',
                title: '申请人',
                align: 'center'
            }, {
                field: '项目申请时间',
                title: '项目申请时间',
                align: 'center'
            }, {
                field: '技术负责人',
                title: '技术负责人',
                align: 'center'
            }, {
                field: '技术负责人意见',
                title: '技术负责人意见',
                align: 'center'
            }, {
                field: '不同意原因',
                title: '不同意原因',
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
                field: '项目状态',
                title: '项目状态',
                align: 'center'
            }]
        });
    });