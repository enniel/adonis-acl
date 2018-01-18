'use strict'

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const test = require('japa')
const edge = require('edge.js')
const ViewBindings = require('../../src/ViewBindings')

class View {
  constructor () {
    this.engine = edge
    this.tag = this.engine.tag.bind(this.engine)
  }
}

test.group('View Can Tag', function (group) {
  test('skip code inside can block', (assert) => {
    ViewBindings(new View())

    const template = `
    @can('view_user && edit_user')
      <h2> You are can view and edit user </h2>
    @endcan
    `

    assert.equal(edge.renderString(template).trim(), '')
  })

  test('render code inside can block', (assert) => {
    ViewBindings(new View())

    const template = `
    @can('view_user && edit_user')
      <h2> You are can view and edit user </h2>
    @endcan
    `

    const data = {
      acl: {
        permissions: ['view_user', 'edit_user']
      }
    }
    assert.equal(edge.renderString(template, data).trim(), '<h2> You are can view and edit user </h2>')
  })

  test('render code inside else block', (assert) => {
    ViewBindings(new View())

    const template = `
    @can('view_user && edit_user')
      <h2> You are can view and edit user </h2>
    @else
      <h2> You are not can view and edit user </h2>
    @endcan
    `

    const data = {
      acl: {
        permissions: ['delete_user']
      }
    }
    assert.equal(edge.renderString(template, data).trim(), '<h2> You are not can view and edit user </h2>')
  })
})

test.group('View Is Tag', function (group) {
  test('skip code inside is block', (assert) => {
    ViewBindings(new View())

    const template = `
    @is('administrator || moderator')
      <h2> You are can view, edit && delete blog post </h2>
    @endis
    `

    assert.equal(edge.renderString(template).trim(), '')
  })

  test('render code inside is block', (assert) => {
    ViewBindings(new View())

    const template = `
    @is('administrator || moderator')
      <h2> You are can view, edit && delete blog post </h2>
    @endis
    `

    const data = {
      acl: {
        roles: ['administrator']
      }
    }
    assert.equal(edge.renderString(template, data).trim(), '<h2> You are can view, edit && delete blog post </h2>')
  })

  test('render code inside else block', (assert) => {
    ViewBindings(new View())

    const template = `
    @is('administrator || moderator')
      <h2> You are can view, edit && delete blog post </h2>
    @else
      <h2> You are not can view, edit && delete blog post </h2>
    @endis
    `

    const data = {
      acl: {
        roles: ['customer']
      }
    }
    assert.equal(edge.renderString(template, data).trim(), '<h2> You are not can view, edit && delete blog post </h2>')
  })
})

test.group('View Scope Tag', function (group) {
  test('skip code inside scope block', (assert) => {
    ViewBindings(new View())

    const template = `
    @scope('user.view', 'user.edit')
      <h2> You are can view and edit user </h2>
    @endscope
    `

    assert.equal(edge.renderString(template).trim(), '')
  })

  test('render code inside scope block', (assert) => {
    ViewBindings(new View())

    const template = `
    @scope('user.view', 'user.edit')
      <h2> You are can view and edit user </h2>
    @endscope
    `

    const data = {
      acl: {
        permissions: ['user.view', 'user.edit']
      }
    }
    assert.equal(edge.renderString(template, data).trim(), '<h2> You are can view and edit user </h2>')
  })

  test('render code inside else block', (assert) => {
    ViewBindings(new View())

    const template = `
    @scope('user.view', 'user.edit')
      <h2> You are can view and edit user </h2>
    @else
      <h2> You are can not view and edit user </h2>
    @endscope
    `

    const data = {
      acl: {
        permissions: ['user.delete']
      }
    }
    assert.equal(edge.renderString(template, data).trim(), '<h2> You are can not view and edit user </h2>')
  })
})
