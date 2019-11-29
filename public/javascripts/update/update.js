    $(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '标准查新名称',
                title: '标准查新名称',
                align: 'center'
            }, {
                field: '查新时间',
                title: '查新时间',
                align: 'center'
            }, {
                field: '查新人员',
                title: '查新人员',
                align: 'center'
            }, {
                field: '查新结果',
                title: '查新结果',
                align: 'center'
            }, {
                field: '状态',
                title: '状态',
                align: 'center'
            }]
        });
    });