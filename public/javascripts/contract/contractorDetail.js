$(document).ready(function() {
        $('#table_page').bootstrapTable({
            columns: [
            {
                field: '分包方单位',
                title: '分包方单位',
                align: 'center'
            }, {
                field: '分包项目',
                title: '分包项目',
                align: 'center'
            }, {
                field: '分包内容',
                title: '分包内容',
                align: 'center'
            }, {
                field: '委托方意见证明',
                title: '委托方意见证明',
                align: 'center'
            }]
        });
    });